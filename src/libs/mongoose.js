import mongoose from 'mongoose';
import config from  './config';

mongoose.set('debug', true);

export default mongoose.connect(config.mongo.connect, config.mongo.options);
