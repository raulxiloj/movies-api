const express = require('express');

const { getMovies, getDetailMovie, createComment, getMovieComments } = require('../controllers/movies');
const checkJWT = require('../middlewares/check-jwt');

const router = express.Router();

/**
 * @swagger
 * tags:
 *  name: Movies
 */

/**
 * @swagger
 * /api/movies/:
 *  get:
 *      summary: Obtiene las peliculas que concuerdan con el nombre que se manda en los query parameters
 *      tags: [Movies]
 *      parameters:
 *          - in: header
 *            name: Token
 *            schema:
 *              type: string
 *            description: token para verificar el usuario y poder acceder a los recursos
 *          - in: query
 *            name: name
 *            schema:
 *              type: string
 *            description: String con el nombre de la pelicula a buscar    
 *      responses:
 *          200:
 *              description: Lista de peliculas
 *          401: 
 *              description: No autorizado (Se necesita el token)
 */
router.get('/', checkJWT,  getMovies);

/**
 * @swagger
 * /api/movies/{id}:
 *  get:
 *      summary: Obtiene el detalle de alguna pelicula por medio de su ID
 *      tags: [Movies]
 *      parameters:
 *          - in: header
 *            name: Token
 *            schema:
 *              type: string
 *            description: token para verificar el usuario y poder acceder a los recursos
 *          - in: path
 *            name: id
 *            required: true
 *            description: Id de la pelicula
 *      responses:
 *          200:
 *             description: Detalle de la pelicula 
 */
router.get('/:id', checkJWT, getDetailMovie);

/**
 * @swagger
 * /api/movies/{id}/comment:
 *  post:
 *      summary: Crea un comentario y lo asocia a la pelicula y al usuario
 *      tags: [Movies]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      Comment:
 *                          type: object
 *                      required:
 *                          - username
 *                          - content
 *                      properties:
 *                          username:
 *                              type: string
 *                          content: 
 *                              type: string
 *                      example:
 *                          username: raulxiloj
 *                          content: Este es un comentario de prueba
 *      parameters:
 *          - in: header
 *            name: Token
 *            schema:
 *              type: string
 *            description: token para verificar el usuario y poder acceder a los recursos
 *          - in: path
 *            name: id
 *            required: true
 *            description: Id de la pelicula
 *      responses:
 *          200:
 *             description: Mensaje con confirmacion de creacion del comentario
 *          401:
 *             description: No autorizado, falta el token
 */
router.post('/:id/comment', checkJWT, createComment);

/**
 * @swagger
 * /api/movies/{id}/comments:
 *  get:
 *      summary: Se obtienen los comentarios de las peliculas por su id
 *      tags: [Movies]
 *      parameters:
 *          - in: header
 *            name: Token
 *            schema:
 *              type: string
 *            description: token para verificar el usuario y poder acceder a los recursos
 *          - in: path
 *            name: id
 *            required: true
 *            description: Id de la pelicula
 *      responses:
 *          200:
 *             description: Detalle de la pelicula 
 */
router.get('/:id/comments', checkJWT, getMovieComments);

module.exports = router;