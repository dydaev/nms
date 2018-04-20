import session from 'express-session';
import mongoose from './mongoose';
const MongoStore = require('connect-mongo')(session);

export default new MongoStore({ mongooseConnection: mongoose.connection });
