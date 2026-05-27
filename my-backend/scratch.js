import mongoose from 'mongoose';
import 'dotenv/config';

async function run() {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/devconnect');
  
  const db = mongoose.connection.db;
  const users = await db.collection('users').find().toArray();
  
  if (users.length === 0) {
    console.log('NO USERS FOUND');
    process.exit(1);
  }
  
  for (const user of users) {
    let company = await db.collection('companies').findOne({ createdBy: user._id });
    if (!company) {
      const res = await db.collection('companies').insertOne({
        name: "Test Company for " + user.name,
        description: "A company for testing",
        location: "Remote",
        industry: "Testing",
        createdBy: user._id,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      console.log(`Email: ${user.email} -> NEW Company ID: ${res.insertedId.toString()}`);
    } else {
      console.log(`Email: ${user.email} -> EXISTING Company ID: ${company._id.toString()}`);
    }
  }

  process.exit(0);
}

run();
