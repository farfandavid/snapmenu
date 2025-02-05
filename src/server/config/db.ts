import mongoose from 'mongoose';

const connectDB = async () => {
  await mongoose.connect(import.meta.env.MONGO_URI,
    {
      dbName: "menuonline",
    }
  )
    .catch(err => console.log(err));
};

const disconnectDB = async () => {
  await mongoose.disconnect()
    .then(() => console.log('MongoDB disconnected...'))
    .catch(err => console.log(err));
};

export default { connectDB, disconnectDB };