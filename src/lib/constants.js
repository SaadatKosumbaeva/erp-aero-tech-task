export const ERRORS = {
  email: 'Email is not valid',
  password: 'Password is required',
  userExist: 'User with this email already exists',
  userNotFound: 'User was not found by this email',
  incorrectPassword: 'Incorrect email or password',
  refreshTokenRequired: 'Refresh token is required',
  refreshTokenExpired: 'Refresh token is expired',
  incorrectRefreshToken: 'Incorrect refresh token',
}

export const SALT_WORK_FACTOR = 10;

export const ENV = {
  NODE_PORT: 'NODE_PORT',
  DB_HOST: 'DB_HOST',
  DB_NAME: 'DB_NAME',
  DB_USER: 'DB_USER',
  DB_PASSWORD: 'DB_PASSWORD',
  DB_PORT: 'DB_PORT',
  JWT_AUTH_SECRET: 'JWT_AUTH_SECRET',
  JWT_REFRESH_SECRET: 'JWT_REFRESH_SECRET',
  JWT_EXP_TIME: 'JWT_EXP_TIME',
  JWT_REFRESH_EXP_TIME: 'JWT_REFRESH_EXP_TIME'
};

