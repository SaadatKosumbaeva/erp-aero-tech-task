import { ENV, ERRORS } from '../lib/constants.js';
import { queryDatabase, validateToken } from '../lib/helpers.js';

export const authenticate = async (req, res, next) => {
  if (req.path === '/signin'
    || req.path === '/signup'
    || req.path === '/signin/new_token') {
    return next()
  }

  const token = req.headers['authorization'];
  if (!token) {
    res.status(401).json({errors: [ERRORS.unauthorized]});
  }

  const decoded = validateToken(token, process.env[ENV.JWT_AUTH_SECRET]);
  if (decoded.hasOwnProperty('errors')) {
    return res.status(400).send({errors: decoded.errors});
  }

  const findExistUserQuery = 'SELECT * FROM users WHERE id = ?';
  const existUser = await queryDatabase(findExistUserQuery, [decoded.email]);
  if (!existUser.length) {
    return res.status(400).send({errors: [ERRORS.userNotFound]});
  }

  req.user = existUser[0];
  next();
}

