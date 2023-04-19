/**
 * Install lib: yarn add mongoose@^6.10.0 dotenv
 * Test: node -e "require('./mongodb.js').connect()"
 */

require('dotenv').config();
const mongoose = require('mongoose');
mongoose.set('strictQuery', false);

let _mongoose;
const connect = async () => {
  if (!_mongoose) {
    try {
      _mongoose = await mongoose.connect(process.env.MONGODB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        directConnection: true,
        // useCreateIndex: true,
        // useFindAndModify: false,
        // retryAttempts: 3,
      });
      console.log('Database Connected');

      /// Create initial collection natively
      /// or we can just use mongoose schema with model
      // const dbNames = await _mongoose.connection.db.listCollections().toArray();
      // const initialColName = 'configs';
      // const initialColExist = dbNames.filter((value, index) => value['name'] === initialColName).length === 1;
      // if (!initialColExist) {
      //   await _mongoose.connection.createCollection(initialColName);
      // }
      return _mongoose;
    } catch (e) {
      console.log('Error Connecting to Database', e);
    }
  }
  return null;
};

const ConfigSchema = new mongoose.Schema({
  key: String,
  value: String,
});
const ConfigModel = mongoose.model('dump_config', ConfigSchema, 'DumpConfigs');

const readConfigValue = async (key) => {
  try {
    await connect();
    return await ConfigModel.findOne({ key });
  } catch (e) {
    console.log('Error readConfigValue', e);
  }
};

const writeConfigValue = async (key, value) => {
  try {
    await connect();
    let config = await ConfigModel.findOne({ key });
    if (!config) {
      config = new ConfigModel({ key, value });
    } else {
      config.value = value;
    }
    await config.save();
    console.log(`Wrote config to DB: ${key} = ${value}`);
  } catch (e) {
    console.log('Error writeConfigValue', e);
  }
};

module.exports = {
  connect,
  readConfigValue,
  writeConfigValue,
};