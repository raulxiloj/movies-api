const axios = require('axios');
const { pool } = require('../database/db-config');
const { findUser } = require('./auth');

const getMovies = async (req, res) => {

    const tempRes = await axios.get('https://itunes.apple.com/search', {
        params: {
            term: req.query.name,
            media: 'movie',
            limit: 25
        }
    });

    const response = tempRes.data.results.map(mov => {
        const { kind, trackId, trackName, collectionViewUrl, longDescription } = mov;
        return {
            kind, trackId, trackName, collectionViewUrl, longDescription
        }
    });

    res.json(response);

}

const getDetailMovie = async (req, res) => {

    const response = await axios.get('https://itunes.apple.com/lookup', {
        params: {
            id : req.params.id
        }
    });
    
    res.json(response.data.results[0]);

}

const createComment = async (req, res) => {
    
    const { username, content } = req.body;

    //Check if the user exists
    const user = await findUser(username);

    if(!user){
        return res.status(401).json({
            ok: false,
            msg: 'No existe ningun usuario con este nombre de usuario, no se puede guardar el comentario'
        });
    }

    await pool.query('INSERT INTO comment(id_movie, id_user, content) VALUES($1,$2,$3);', [req.params.id, user.id, content]);

    res.json({
        ok: true,
        msg: 'Comentario registrado con exito'
    });

}

const getMovieComments = async (req, res) => {
    const query = `SELECT *
                   FROM comment c INNER JOIN users u 
                   ON c.id_user = u.id
                   WHERE id_movie = $1;`

    const { rows } = await pool.query(query,[req.params.id]);

    const response = rows.map(row => {
        const { id_movie, created_at, content, username } = row;
        return {
            id_movie, created_at, content, username
        }
    });

    res.json(response);
}

module.exports = {
    getMovies,
    getDetailMovie,
    createComment,
    getMovieComments
}