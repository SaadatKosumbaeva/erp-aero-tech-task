import express from 'express';
import { body, validationResult } from 'express-validator';
import { getPassHash, getTokens, isPasswordValid, queryDatabase } from '../lib/helpers.js';
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
    if (existUser) return res.status(400).send({errors: [ERRORS.userExist]});

    const user = req.body;
    const userObj = {
      id: user.email,
      password: await getPassHash(user.password),
    };

    let createUserQuery = 'INSERT INTO users (id, password) VALUES (?,?)';
    await queryDatabase(createUserQuery, [userObj.id, userObj.password]);

    const tokens = getTokens(userObj.id);

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

    if (!foundUser) {
      return res.status(400).send({errors: [ERRORS.userNotFound]});
    }

    const isValidPassword = await isPasswordValid(req.body.password, foundUser.password);
    if (!isValidPassword) return res.status(400).json({errors: [ERRORS.incorrectPassword]});

    const tokens = getTokens(foundUser.email);

    return res.status(200).json({data: tokens});
  } catch (e) {
    return next(e);
  }
})

export const authRouter = router;
