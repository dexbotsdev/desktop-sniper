/* eslint-disable prettier/prettier */
/* eslint-disable no-param-reassign */
/* eslint-disable no-plusplus */
/* eslint-disable no-else-return */
/* eslint-disable no-console */

import { BigNumber, Contract, ethers } from "ethers";
import { WETH_CONTRACT, router } from "../../../constants/contracts";
import { CalculateTokenAmountProps, BuyTokenProps, BuyTokenRecursiveProps } from "../../models/erc20";

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
      console.log(
        amountIn,
        amountOut,
        gasLimit,
        gasPrice,
        contractAddress
      )
      const tx = null;
      // const tx = await router(account.buyer).swapExactETHForTokensSupportingFeeOnTransferTokens(
      //     amountOut,
      //     [WETH_CONTRACT, contractAddress],
      //     account.receiver,
      //     Date.now() + 1000 * 60 * 1,
      //     {
      //       value: amountIn,
      //       gasLimit,
      //       gasPrice,
      //       nonce: null,
      //     }
      //   )
      //   .catch((err: unknown) => {
      //     console.log(err);
      //     return null;
      //   });
      return { tx, account };
    };
    const getContractDetails = async (contract: Contract) => {
        return {supply: contract.totalSupply(), name: contract.name()};
    }
    return { calculateBuyGas, calculateTokenAmounts, buyToken, getContractDetails };
  };

  type RecursiveReturnType = Promise<void | "complete">;
  export async function buyTokensRecursive(props: BuyTokenRecursiveProps, count: number):RecursiveReturnType {
    count += 1;
    const { buyToken } = erc20Utils();
    const buyer = props.accounts[count];
    buyToken({...props, account: buyer});
    if(count >= props.accounts.length){
        return "complete";
    } else {
        return buyTokensRecursive(props, count);
    }
  }