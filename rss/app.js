import express from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUI from 'swagger-ui-express';
import bodyParser from 'body-parser';
import { WishRouter } from './routers/wishRouter.js';
dotenv.config({ path: './.env' });

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(WishRouter);

// Swagger
const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'RSS Wishes API',
            version: '1.0.0',
        },
    },
    apis: ['./routers/*.js'],
};

const openapiSpecification = swaggerJsDoc(options);
app.use('/docs', swaggerUI.serve, swaggerUI.setup(openapiSpecification));


const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
});