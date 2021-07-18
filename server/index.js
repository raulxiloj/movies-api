require('dotenv').config();

const express = require('express');
const cors = require('cors');
const swaggerUI = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');

const { validateConnection } = require('./src/database/db-config');

const PORT = process.env.PORT;

const swOptions = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Movies API",
            version: "1.0.0",
            description: "Simple express API using the itunes API too."
        },
        servers: [
            {
                url: "http://localhost:4000"
            }
        ]
    },
    apis: ["./src/routes/*.js"]
}

const specs = swaggerJsDoc(swOptions);

const app = express();

//Middlewares
app.use(cors());
app.use(express.json());

//Routes
app.use('/api/auth', require('./src/routes/auth'));
app.use('/api/movies', require('./src/routes/movies'));
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(specs));

app.get('/', (req, res) => {
    res.json({msg: 'Technical test tribal MnC'});
});

validateConnection()
.then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on ${PORT}`);
    })
}).catch((error) => console.log(error));

