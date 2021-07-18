const jwt = require('jsonwebtoken');

const generateJWT = (id, name) => {
    const payload = { id, name };
    const token = jwt.sign(payload, process.env.SECRET_JWT_KEY, {
        expiresIn: '2h' 
    });
    return token;
}

module.exports = {
    generateJWT
}