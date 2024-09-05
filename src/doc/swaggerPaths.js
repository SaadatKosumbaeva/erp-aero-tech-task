/**
 * @swagger
 * /signup:
 *   post:
 *     summary: Register a new user
 *     description: This endpoint allows a new user to sign up by providing an email and password.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: The user's email address.
 *                 example: user@mail.com
 *               password:
 *                 type: string
 *                 description: The user's password.
 *                 example: 123456
 *     responses:
 *       201:
 *         description: User successfully created with authentication tokens.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     accessToken:
 *                       type: string
 *                       description: Access token for the user.
 *                     refreshToken:
 *                       type: string
 *                       description: Refresh token for the user.
 *       400:
 *         description: Bad request due to validation errors.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       type:
 *                         type: string
 *                         description: Type of error, usually "field".
 *                         example: "field"
 *                       value:
 *                         type: string
 *                         description: The invalid value provided by the user.
 *                         example: "usemail.com"
 *                       msg:
 *                         type: string
 *                         description: Error message describing what went wrong.
 *                         example: "Email is not valid"
 *                       path:
 *                         type: string
 *                         description: The parameter which caused the error.
 *                         example: "email"
 *                       location:
 *                         type: string
 *                         description: Where the error occurred (e.g., 'body').
 *                         example: "body"
 */

/**
 * @swagger
 * /signin:
 *   post:
 *     summary: Sign in an existing user
 *     description: This endpoint allows an existing user to sign in by providing an email and password.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: The user's email address.
 *                 example: user@mail.com
 *               password:
 *                 type: string
 *                 description: The user's password.
 *                 example: 123456
 *     responses:
 *       200:
 *         description: User successfully authenticated with authentication tokens.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     accessToken:
 *                       type: string
 *                       description: Access token for the user.
 *                     refreshToken:
 *                       type: string
 *                       description: Refresh token for the user.
 *       400:
 *         description: Bad request due to validation errors or user not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       type:
 *                         type: string
 *                         description: Type of error, usually "field".
 *                         example: "field"
 *                       value:
 *                         type: string
 *                         description: The invalid value provided by the user.
 *                         example: "usemail.com"
 *                       msg:
 *                         type: string
 *                         description: Error message describing what went wrong.
 *                         example: "Email is not valid"
 *                       path:
 *                         type: string
 *                         description: The parameter which caused the error.
 *                         example: "email"
 *                       location:
 *                         type: string
 *                         description: Where the error occurred (e.g., 'body').
 *                         example: "body"
 *       403:
 *         description: Access denied due to invalid credentials.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errors:
 *                   type: array
 *                   items:
 *                         type: string
 *                         description: Error message describing access denial reason.
 *                         example: "Access denied"
 */

/**
 * @swagger
 * /signin/new_token:
 *   post:
 *     summary: Generate a new access token using a refresh token
 *     description: This endpoint allows users to get a new access token by providing a valid refresh token.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 description: The refresh token to generate a new access token.
 *                 example: 'your-refresh-token-here'
 *     responses:
 *       200:
 *         description: New tokens generated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     accessToken:
 *                       type: string
 *                       description: New access token for the user.
 *                     refreshToken:
 *                       type: string
 *                       description: New refresh token for the user.
 *       400:
 *         description: Bad request due to validation errors, incorrect refresh token, or expired refresh token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errors:
 *                   type: array
 *                   items:
 *                         type: string
 *                         description: Error message describing what went wrong.
 *                         example: "Refresh token is required"
 *       401:
 *         description: Unauthorized due to invalid or expired tokens.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errors:
 *                   type: array
 *                   items:
 *                         type: string
 *                         description: Error message describing unauthorized access.
 *                         example: "Refresh token expired"
 */

/**
 * @swagger
 * /info:
 *   get:
 *     summary: Get user information
 *     description: Returns the user information based on the authenticated user's token.
 *     tags:
 *       - Authentication
 *     security:
 *       - bearerAuth: []  # Indicates that this endpoint requires a Bearer token for authentication
 *     responses:
 *       200:
 *         description: Successfully retrieved user information.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     userId:
 *                       type: string
 *                       description: The ID of the authenticated user.
 *                       example: "user@mail.com"
 *       401:
 *         description: Unauthorized, token is missing or invalid.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errors:
 *                   type: array
 *                   items:
 *                         type: string
 *                         description: Error message.
 *                         example: "Unauthorized"
 */

/**
 * @swagger
 * /logout:
 *   get:
 *     summary: Log out the user
 *     description: Deletes all existing refresh tokens for the authenticated user, effectively logging them out.
 *     tags:
 *       - Authentication
 *     security:
 *       - bearerAuth: []  # Indicates that this endpoint requires a Bearer token for authentication
 *     responses:
 *       200:
 *         description: Successfully logged out the user.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message confirming logout.
 *                   example: "Successfully logged out"
 */
