import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import usersRouter from './routes/users.routes.js';
import pollsRouter from './routes/polls.routes.js';
import { isAuthenticated } from './utils/auth.js';
import SocketConnection from './utils/socket.js';
import path from 'path';
const __dirname = path.resolve();
dotenv.config();
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '/dist/static')));
app.use(express.json());
app.set('views', path.join(__dirname, '/dist/views'));
app.set('view engine', 'ejs');
app.use(cookieParser());
async function startApp() {
    mongoose.connect(process.env.DATABASE_URL)
        .then(() => { console.log('DB Connected'); })
        .catch(e => console.log(e));
    const appServer = app.listen(process.env.PORT, () => console.log(`Started on port:${process.env.PORT}`));
    SocketConnection(appServer);
}
app.use('/users', usersRouter);
app.get('', isAuthenticated, (req, res) => res.render('home.ejs'));
app.use('/polls', pollsRouter);
startApp();
//# sourceMappingURL=index.js.map