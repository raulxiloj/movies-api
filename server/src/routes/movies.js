const express = require('express');

const { getMovies, getDetailMovie, createComment, getMovieComments } = require('../controllers/movies');

const router = express.Router();

router.get('/', getMovies);
router.get('/:id', getDetailMovie);
router.post('/:id/comment', createComment);
router.get('/:id/comments', getMovieComments);

module.exports = router;