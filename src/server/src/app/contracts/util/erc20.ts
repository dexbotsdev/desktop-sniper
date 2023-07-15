/* eslint-disable prettier/prettier */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
/* eslint-disable no-plusplus */
/* eslint-disable no-else-return */
/* eslint-disable no-console */

import { BigNumber, Contract, ethers } from "ethers";
import { WETH_CONTRACT, router } from "../../../constants/contracts";
import { CalculateTokenAmountProps, BuyTokenProps, BuyTokenRecursiveProps, BuyTokenDto, SnipeTransactionDto } from "../../models/erc20";
import { mainAccount } from "../../../constants";
import { constructBuyTokenDtoArray } from "../../controllers/wallet";

export default function erc20Utils() {
    const calculateBuyGas = ({_gasPrice, _gasLimit}:{_gasPrice: BigNumber, _gasLimit: BigNumber}) => {
      const gasLimit = ethers.utils.parseUnits(_gasLimit.toString(), 'wei');
      const gasPrice = ethers.utils.parseUnits(_gasPrice.toString(),'wei');
      return { gasLimit, gasPrice };
    };
    const calculateTokenAmounts = async ({ account, tokenAmount, _contract, slippage, }: CalculateTokenAmountProps) => {
      try {
        const amounts = await router(account).getAmountsIn(tokenAmount, [WETH_CONTRACT,_contract.address]);
        const amountIn = amounts[0].add(amounts[0].div(100).mul(slippage));
        const amountOutMin = tokenAmount;
        return { amountIn, amountOutMin };
      } catch (err) {
        return null;
      }
    };
    const buyToken = async ({ account, amountIn, amountOut, gasLimit, gasPrice, contractAddress }: BuyTokenProps) => {
      const tx = await router(account.buyer).swapExactETHForTokensSupportingFeeOnTransferTokens(
          amountOut,
          [WETH_CONTRACT, contractAddress],
          account.receiver,
          Date.now() + 1000 * 60 * 1,
          {
            value: amountIn,
            gasLimit,
            gasPrice,
            nonce: null,
          }
        )
        .catch((err: unknown) => {
          console.log(err);
          return null;
        });
      return { tx, account };
    };
    const getContractDetails = async (contract: Contract) => {
        return {supply: await contract.totalSupply(), name: await contract.name()};
    }
    return { calculateBuyGas, calculateTokenAmounts, buyToken, getContractDetails };
  };

  type RecursiveReturnType = Promise<void | Promise<{ tx: null; account: BuyTokenDto }>[]>;
  export async function buyTokensRecursive(props: BuyTokenRecursiveProps, count: number, results: Promise<{ tx: null; account: BuyTokenDto}>[]):RecursiveReturnType {
    count += 1;
    const { buyToken } = erc20Utils();
    const buyer = props.accounts[count];
    for(let i = 0; i <= props.accounts.length; i += 1){
      const result = buyToken({...props, account: buyer});
      if(result){
        results.push(result);
      }
    }
    if(results.length === props.accounts.length || count >= 1){
      // all buys succeeded, or count limit reached
        return results;
    } else {
      // buys have failed
      return buyTokensRecursive({
        ...props,
         accounts: props.accounts
         .filter(account => account !== props.accounts[count])
        }, count, results);
    }
  }

  const { calculateBuyGas, calculateTokenAmounts, getContractDetails } = erc20Utils();

  export const generateBuyOrderFromSnipeTransaction = async (props: SnipeTransactionDto, contract: Contract): Promise<BuyTokenRecursiveProps | null> => {
    const details = await getContractDetails(contract);
    if(details){
      const tokenAmount = BigNumber.from(details.supply).div(100).mul(props._buyPercentage);
      const buyOrder = await calculateTokenAmounts({tokenAmount, account: mainAccount, _contract: contract, slippage: props._slippage});
      if(buyOrder){
        const { gasLimit, gasPrice } = calculateBuyGas({ _gasLimit: BigNumber.from(props._gasLimit), _gasPrice: BigNumber.from(props._gasPrice) });
        const wallets = constructBuyTokenDtoArray(props._accounts);
        if(wallets){
          return { accounts: wallets, amountIn: buyOrder.amountIn, amountOut: buyOrder.amountOutMin, gasLimit, gasPrice, contractAddress: props._address }
        }
      }
  }
  return null;
}