/* eslint-disable prettier/prettier */
/* eslint-disable no-console */
import express from 'express';
import { getAllWallets, getMainWallet } from '../../controllers/wallet';

const router = express.Router();

router.get('/', async (req: express.Request, res: express.Response) => {
  const { main } = req.query;
  console.log(main)
  try {
    if(main || main === 'true'){
      await getMainWallet(req,res);
    } else {
      await getAllWallets(req, res);
    }
  } catch (err) {
    res.sendStatus(500);
  }
});

export default router;
