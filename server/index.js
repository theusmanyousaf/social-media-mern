import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';

/* CONFIGURATIONS */

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename); // this configuration is used when we are using es6 instead of commonjs
dotenv.config();
const app = express();

app.use(express.json());

app.use(helmet())
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" })); // for using different third party cockies or resources
app.use(morgan("common")) // logger middleware
app.use(bodyParser.json({ limit: '30mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }));
app.use(cors()) // invokes the cross origin resource sharing policy
app.use('/assets', express.static(path.join(__dirname, 'public/assets')));

/* FILE STORAGE */
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/assets");
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    },
});
const upload = multer({ storage });

/* MONGOOSE SETUP */
const port = process.env.PORT || 5001

mongoose.connect(process.env.MONGO_URL).then(()=>{
    app.listen(port, () => {
        console.log(`Server is listening to port ${port}`);
    })
}).catch((err) => console.log(`${err} did not connect`))
