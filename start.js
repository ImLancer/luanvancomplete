import app from './server.js'

import {connectDB} from './config/db.js';
import dotenv from 'dotenv';
dotenv.config();

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
    app.listen(PORT, () => console.log(`Serving on: http://localhost:${PORT}`));
});

//app.listen(PORT, () => console.log(`Serving on: http://localhost:${PORT}`));