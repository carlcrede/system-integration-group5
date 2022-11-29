import express from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';
dotenv.config({ path: './.env' });

const app = express();
app.use(cors());

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
});