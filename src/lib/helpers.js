import * as bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { SALT_WORK_FACTOR } from './constants.js';
import dbConnection from '../database/db-connection.js';

export async function getPassHash(password) {
  const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
  const hash = await bcrypt.hash(password, salt);

  return hash;
}

export function queryDatabase(query, params) {
  return new Promise((resolve, reject) => {
    dbConnection.query(query, params, (err, result) => {
      if (err) return reject(err);

      resolve(result[0]);
    });
  });
}

export function getTokens(email) {
  const authToken = jwt.sign(
    {email},
    process.env.JWT_SECRET,
    {expiresIn: process.env.JWT_EXP_TIME},
  );

  const refreshToken = jwt.sign(
    {email},
    process.env.JWT_SECRET,
    {expiresIn: process.env.JWT_REFRESH_EXP_TIME},
  );

  return {authToken, refreshToken};
}

export async function isPasswordValid(incomingPass, userPass) {
  const validPassword = await bcrypt.compare(incomingPass, userPass);
  return !!validPassword;
}
