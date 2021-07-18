require('dotenv').config();

const express = require('express');
const cors = require('cors');

const { validateConnection } = require('./src/database/db-config');

const PORT = process.env.PORT;

const app = express();

//Middlewares
app.use(cors());
app.use(express.json());

//Routes
app.use('/api/auth', require('./src/routes/auth'));
app.use('/api/movies', require('./src/routes/movies'));

app.get('/', (req, res) => {
    res.json({msg: 'Technical test tribal MnC'});
});

validateConnection()
.then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on ${PORT}`);
    })
}).catch((error) => console.log(error));

