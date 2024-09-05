import * as bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { ENV, SALT_WORK_FACTOR } from './constants.js';
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

      resolve(result);
    });
  });
}

export async function getTokens(email) {
  const authToken = jwt.sign(
    {email},
    process.env[ENV.JWT_AUTH_SECRET],
    {expiresIn: process.env[ENV.JWT_EXP_TIME]},
  );

  const refreshToken = jwt.sign(
    {email},
    process.env[ENV.JWT_REFRESH_SECRET],
    {expiresIn: process.env[ENV.JWT_REFRESH_EXP_TIME]},
  );

  await createRefreshToken(refreshToken, email);

  return {authToken, refreshToken};
}

export async function isPasswordValid(incomingPass, userPass) {
  const validPassword = await bcrypt.compare(incomingPass, userPass);
  return !!validPassword;
}

export function isDateExpired(sec) {
  const now = Date.now();

  return new Date(sec * 1000).getTime() < now;
}

export function validateToken(token, secret) {
  const errors = [];

  try {
    const decoded = jwt.verify(token, secret);
    return decoded;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      errors.push('Token has expired.');
    } else if (error instanceof jwt.JsonWebTokenError) {
      errors.push('Invalid token.');
    } else if (error instanceof jwt.NotBeforeError) {
      errors.push('Token is not active yet.');
    } else {
      errors.push('An error occurred while verifying the token.');
    }
  }

  return {errors};
}

export async function deleteExistRefreshTokens(user_id) {
  const findExistRefreshTokenQuery = 'SELECT * FROM tokens WHERE user_id = ?';
  const refreshTokens = await queryDatabase(findExistRefreshTokenQuery, [user_id]);

  if (refreshTokens && refreshTokens.length > 0) {
    const deleteRefreshTokenQuery = 'DELETE FROM tokens WHERE refresh_token = ?';

    for (const token of refreshTokens) {
      await queryDatabase(deleteRefreshTokenQuery, [token['refresh_token']]);
    }
  }
}

export async function createRefreshToken(refreshToken, userId) {
  await deleteExistRefreshTokens(userId);

  const decodedRefreshToken = jwt.verify(refreshToken, process.env[ENV.JWT_REFRESH_SECRET]);

  const createTokenQuery = 'INSERT INTO tokens (refresh_token, exp_date, user_id) VALUES (?, ?, ?)';
  await queryDatabase(createTokenQuery, [refreshToken, new Date(decodedRefreshToken.exp * 1000), userId]);
}

