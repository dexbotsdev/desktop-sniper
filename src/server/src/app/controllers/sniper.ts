/* eslint-disable prettier/prettier */
/* eslint-disable no-console */
import express from 'express';
import { TokenData } from '../models/token-data';

export const createSniperInstance = async (
  req: express.Request,
  res: express.Response
) => {
  const data: TokenData = req.body;
  console.log(req);
  res.status(200).send(data);
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const removeSniperInstance = async (
  req: express.Request,
  res: express.Response
) => {
  res.sendStatus(200);
};
