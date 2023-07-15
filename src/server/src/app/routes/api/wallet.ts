/* eslint-disable prettier/prettier */
/* eslint-disable no-console */
import express from 'express';
import { getAllWallets, getMainWallet, sendMultiWalletTransaction } from '../../controllers/wallet';

const router = express.Router();

router.get('/', async (req: express.Request, res: express.Response) => {
  const { main } = req.query;
  try {
    if(main){
      await getMainWallet(req,res);
    } else {
      await getAllWallets(req, res);
    }
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

router.post('/multisend', async (req: express.Request, res: express.Response) => {
  try{
    await sendMultiWalletTransaction(req,res);
  } catch (err){
    console.log(err);
    res.sendStatus(500);
  }
})

export default router;
