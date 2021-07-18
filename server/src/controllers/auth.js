const bcrypt = require('bcryptjs');
const validator = require('validator');
const { pool } = require('../database/db-config');
const { generateJWT } = require('../helpers/jwt');

const findUser = async (username) => {
    const { rows } = await pool.query('SELECT * FROM users WHERE username = $1;',[username]);
    return rows[0] || null;
}

const signUp = async (req, res) => {

    let { name, username, password } = req.body;

    try {
        
        if(!validator.isLength(username,{min: 6, max: 12})){
            return res.json({
                ok: false,
                msg: 'Se necesita que el nombre de usuario sea de minimo 6 caracteres y maximo 15'
            });
        }

        if(!validator.isStrongPassword(password, {minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1,  minSymbols: 0})){
            return res.json({
                ok: false,
                msg: 'Se necesita que la contrasena sea de minimo 8 caracteres, que contenga una minuscula, 1 mayuscula y 1 numero como minimo.'
            });
        } 


        //Check if a user with that username doesn't already exist
        const user = await findUser(username);
        if(!user){
            //Encrypt password
            const salt = bcrypt.genSaltSync();
            password = bcrypt.hashSync(password, salt);

            const { rows } = await pool.query('INSERT INTO users(name, username, password) VALUES($1,$2,$3) RETURNING *;', [name, username, password]);
            
            return res.status(201).json({
               ok: true,
               msg: rows[0]   
            });
        }else{
            res.json({
                ok: false,
                msg: 'Ya existe un usuario con ese nombre de usuario'
            });
        }

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error al crear el usuario, contacte al administrador'
        });
    }

}

const signIn = async (req, res) => {

    const { username, password } = req.body;
    
    try {
        
        const user = await findUser(username);

        if(!user){
            return res.status(400).json({
                ok: false,
                msg: 'No existe un usuario con este nombre de usuario'
            });
        }

        //Match passwords
        const validPassword = bcrypt.compareSync(password, user.password);

        if(!validPassword){
            return res.status(400).json({
                ok: false,
                msg: 'Contrasena incorrecta'
            });
        }

        //Create token
        const token = generateJWT(user.id, user.name);

        res.json({
            ok: true,
            uid: user.id,
            name: user.name,
            username: user.username,
            token
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error al crear el usuario, contacte al administrador'
        });
    }

}

module.exports = {
    signUp,
    signIn
}