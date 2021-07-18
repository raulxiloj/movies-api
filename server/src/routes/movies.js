const express = require('express');

const { getMovies, getDetailMovie, createComment, getMovieComments } = require('../controllers/movies');
const checkJWT = require('../middlewares/check-jwt');

const router = express.Router();

router.get('/', checkJWT,  getMovies);
router.get('/:id', checkJWT, getDetailMovie);
router.post('/:id/comment', checkJWT, createComment);
router.get('/:id/comments', checkJWT, getMovieComments);

module.exports = router;