/* eslint-disable prettier/prettier */
/* eslint-disable no-console */

import { BigNumber, Contract } from 'ethers';
import erc20Contract from '../../constants/contracts';
import { mainAccount } from '../../constants';
import { sendSniperStatusMessage } from '../sockets/sniper-status';
import erc20Utils, { buyTokensRecursive } from './util/erc20';
import { SnipeTransactionDto } from '../models/erc20';
import { constructBuyTokenDtoArray } from '../controllers/wallet';

let contract: Contract | null = null;
let transactionListener: any;

const { calculateBuyGas, calculateTokenAmounts, getContractDetails } = erc20Utils();

export const listenForERC20Transactions = async ({
  _address,
  _gasPrice,
  _gasLimit,
  _accounts,
  _buyPercentage,
  _slippage
  }: SnipeTransactionDto) => {
    contract = erc20Contract(mainAccount, _address);
    sendSniperStatusMessage('pending');
    transactionListener = contract.on('Transfer', async () => {
      if(contract){
        const totalSupply = (await getContractDetails(contract)).supply;
        const tokenAmount = BigNumber.from(totalSupply).div(100).mul(_buyPercentage);
        const { gasLimit, gasPrice } = calculateBuyGas({ _gasLimit: BigNumber.from(_gasLimit), _gasPrice: BigNumber.from(_gasPrice) });
        const buyOrder = await calculateTokenAmounts({tokenAmount, account: mainAccount, _contract: contract, slippage: _slippage});
        const wallets = constructBuyTokenDtoArray(_accounts);
        if(buyOrder && wallets){
          buyTokensRecursive({
            contractAddress: contract.address,
            accounts: wallets,
            gasLimit,
            gasPrice,
            amountIn: buyOrder.amountIn,
            amountOut: buyOrder.amountOutMin
          },0);
        }
        }
    });
};

export const removeERC20TransactionEventListener = () => {
  contract?.removeListener('Transfer', transactionListener);
  contract = null;
  sendSniperStatusMessage('offline');
};