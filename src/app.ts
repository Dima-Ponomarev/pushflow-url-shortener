import express from 'express';
import * as dotenv from 'dotenv';
import shortenerRoutes from './shortener.routes';

dotenv.config();
const app = express();
const port = process.env.PORT || 8080;

(async () => {
    try {
        app.use(express.json());
        app.use(shortenerRoutes);

        app.listen(port, () => {
            console.log(`Server running on http://localhost:${port}`);
        });
    } catch (error: any) {
        console.error('Error:', error.message);
    }
})();