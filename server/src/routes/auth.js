const express = require('express');
const { signUp, signIn } = require('../controllers/auth');

const router = express.Router();

/**
 * @swagger
 * tags:
 *  name: Auth
 */

/**
 * @swagger
 * /api/auth/signUp:
 *  post:
 *      summary: Registra a un usuario
 *      tags: [Auth]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      User:
 *                          type: object
 *                      required:
 *                          - name
 *                          - username
 *                          - password
 *                      properties:
 *                          name:
 *                              type: string
 *                          username: 
 *                              type: string
 *                          password:
 *                              type: string
 *                      example:
 *                          name: Raul Xiloj
 *                          username: raulxiloj
 *                          password: asdqwe1M
 *      responses:
 *          200:
 *             description: Usuario creado con exito
 */
router.post('/signUp', signUp);

/**
 * @swagger
 * /api/auth/signIn:
 *  post:
 *      summary: Devuelve un token si el usuario tiene las credenciales correctas
 *      tags: [Auth]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      Comment:
 *                          type: object
 *                      required:
 *                          - username
 *                          - password
 *                      properties:
 *                          username:
 *                              type: string
 *                          password: 
 *                              type: string
 *                      example:
 *                          username: raulxiloj
 *                          password: asdqwe1M
 *      responses:
 *          200:
 *             description: Token y algunos datos del usuario
 */
router.post('/signIn', signIn);

module.exports = router;