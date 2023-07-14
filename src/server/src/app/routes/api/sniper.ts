/* eslint-disable prettier/prettier */
/* eslint-disable no-console */
import express from 'express';
import {
  createSniperInstance,
  removeSniperInstance,
} from '../../controllers/sniper';

const router = express.Router();

router.post('/', async (req: express.Request, res: express.Response) => {
  try {
    await createSniperInstance(req, res);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
router.delete('/', async (req: express.Request, res: express.Response) => {
  try {
    await removeSniperInstance(req, res);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

export default router;
