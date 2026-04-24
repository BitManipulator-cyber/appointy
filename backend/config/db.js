const mongoose = require('mongoose');
const sendDebugLog = async (payload) => {
  if (typeof fetch !== 'function') return;
  await fetch('http://127.0.0.1:7691/ingest/db39a939-30d2-4a8e-accd-bf6822262279',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'275aec'},body:JSON.stringify({sessionId:'275aec',...payload,timestamp:Date.now()})}).catch(()=>{});
};

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI;
  let parsedTarget = null;
  if (mongoUri && mongoUri.startsWith('mongodb')) {
    const sanitized = mongoUri.replace(/^mongodb(\+srv)?:\/\//, '').split('@').pop();
    parsedTarget = sanitized ? sanitized.split('/')[0] : null;
  }
  // #region agent log
  sendDebugLog({runId:'initial',hypothesisId:'H1',location:'backend/config/db.js:16',message:'connectDB entry',data:{hasMongoUri:Boolean(mongoUri),mongoTarget:parsedTarget,mongooseState:mongoose.connection.readyState}});
  // #endregion
  if (!mongoUri) {
    // #region agent log
    await sendDebugLog({runId:'initial',hypothesisId:'H2',location:'backend/config/db.js:20',message:'MONGO_URI missing path hit',data:{hasMongoUri:false}});
    // #endregion
    throw new Error('MONGO_URI is not set. Add it to backend/.env before starting the server.');
  }

  try {
    // #region agent log
    sendDebugLog({runId:'initial',hypothesisId:'H3',location:'backend/config/db.js:26',message:'Attempting mongoose.connect',data:{mongoTarget:parsedTarget}});
    // #endregion
    const conn = await mongoose.connect(mongoUri);
    // #region agent log
    sendDebugLog({runId:'initial',hypothesisId:'H4',location:'backend/config/db.js:29',message:'mongoose.connect success',data:{host:conn.connection.host,port:conn.connection.port,name:conn.connection.name}});
    // #endregion
    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
    return conn;
  } catch (err) {
    // #region agent log
    await sendDebugLog({runId:'initial',hypothesisId:'H5',location:'backend/config/db.js:34',message:'mongoose.connect failed',data:{errorName:err.name,errorMessage:err.message,errorCode:err.code||null}});
    // #endregion
    throw new Error(`MongoDB connection error: ${err.message}`);
  }
};

module.exports = connectDB;
