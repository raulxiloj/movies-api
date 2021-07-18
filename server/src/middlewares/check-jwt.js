const jwt = require('jsonwebtoken');

const checkJWT = (req, res, next) => {

    const token = req.headers.token;

    if(!token) {
        return res.status(401).json({
            ok: false,
            msg: 'No autorizado'
        });
    }

    try {
        
        jwt.verify(token, process.env.SECRET_JWT_KEY);
        
    } catch (error) {
        return res.status(401).json({
            ok: false,
            msg: 'Token invalido'
        });
    }

    next();

}

module.exports = checkJWT;