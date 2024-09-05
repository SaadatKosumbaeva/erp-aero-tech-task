import express from 'express';
import { body, validationResult } from 'express-validator';
import {
  getPassHash,
  getTokens,
  isDateExpired,
  isPasswordValid,
  queryDatabase,
  validateToken
} from '../lib/helpers.js';
import { ERRORS } from '../lib/constants.js';

const router = express.Router();

router.post('/signup', [
  body('email').notEmpty().isEmail().withMessage(ERRORS.email),
  body('password').notEmpty().withMessage(ERRORS.password),
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({errors: errors.array()});
    }

    const findExistUserQuery = 'SELECT * FROM users WHERE id = ?';
    const existUser = await queryDatabase(findExistUserQuery, [req.body.email]);
    if (existUser.length) return res.status(400).send({errors: [ERRORS.userExist]});

    const user = req.body;
    const userObj = {
      id: user.email,
      password: await getPassHash(user.password),
    };

    let createUserQuery = 'INSERT INTO users (id, password) VALUES (?,?)';
    await queryDatabase(createUserQuery, [userObj.id, userObj.password]);

    const tokens = await getTokens(userObj.id);

    return res.status(201).json({data: tokens});
  } catch (e) {
    return next(e);
  }
})

router.post('/signin', [
  body('email').notEmpty().isEmail().withMessage(ERRORS.email),
  body('password').notEmpty().withMessage(ERRORS.password),
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({errors: errors.array()});
    }

    const findUserByEmailQuery = 'SELECT * FROM users WHERE id = ?';
    const foundUser = await queryDatabase(findUserByEmailQuery, [req.body.email]);

    if (!foundUser.length) {
      return res.status(400).send({errors: [ERRORS.userNotFound]});
    }

    const isValidPassword = await isPasswordValid(req.body.password, foundUser[0].password);
    if (!isValidPassword) return res.status(400).json({errors: [ERRORS.incorrectPassword]});

    const tokens = await getTokens(foundUser[0].id);

    return res.status(200).json({data: tokens});
  } catch (e) {
    return next(e);
  }
})

router.post('/signin/new_token', [
  body('refreshToken').notEmpty().withMessage(ERRORS.refreshTokenRequired),
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({errors: errors.array()});
    }

    const findRefreshTokenQuery = 'SELECT * FROM tokens WHERE refresh_token = ?';
    const refreshToken = await queryDatabase(findRefreshTokenQuery, [req.body.refreshToken]);
    if (!refreshToken.length) return res.status(400).send({errors: [ERRORS.incorrectRefreshToken]});

    const isTokenExpired = isDateExpired(refreshToken[0]['exp_date']);
    if (isTokenExpired) {
      const deleteRefreshTokenQuery = 'DELETE FROM tokens WHERE refresh_token = ?';
      await queryDatabase(deleteRefreshTokenQuery, [req.body.refreshToken]);
      return res.status(400).send({errors: [ERRORS.refreshTokenExpired]});
    }

    const decoded = validateToken(refreshToken[0]['refresh_token']);
    if (decoded.hasOwnProperty('errors')) return res.status(400).send({errors: decoded.errors});

    const tokens = await getTokens(refreshToken[0]['user_id']);

    return res.status(200).json({data: tokens});
  } catch (e) {
    return next(e);
  }
})

export const authRouter = router;
