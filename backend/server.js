const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db');

const authRoutes = require('./routes/auth');
const appointmentRoutes = require('./routes/appointments');
const doctorRoutes = require('./routes/doctors');
const adminRoutes = require('./routes/admin');
const sendDebugLog = async (payload) => {
  if (typeof fetch !== 'function') return;
  await fetch('http://127.0.0.1:7691/ingest/db39a939-30d2-4a8e-accd-bf6822262279',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'275aec'},body:JSON.stringify({sessionId:'275aec',...payload,timestamp:Date.now()})}).catch(()=>{});
};

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_ORIGIN || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/admin', adminRoutes);

// Health check
app.get('/', (req, res) => res.json({ message: 'Appointy API running ✅' }));

const PORT = process.env.PORT || 5000;
const startServer = async () => {
  // #region agent log
  sendDebugLog({runId:'initial',hypothesisId:'H1',location:'backend/server.js:35',message:'startServer called',data:{port:PORT,hasMongoUri:Boolean(process.env.MONGO_URI),clientOrigin:process.env.CLIENT_ORIGIN||'http://localhost:3000'}});
  // #endregion
  try {
    await connectDB();
    app.listen(PORT, () => {
      // #region agent log
      sendDebugLog({runId:'initial',hypothesisId:'H4',location:'backend/server.js:40',message:'HTTP server listening',data:{port:PORT}});
      // #endregion
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    // #region agent log
    await sendDebugLog({runId:'initial',hypothesisId:'H5',location:'backend/server.js:45',message:'startServer failed',data:{errorMessage:error.message}});
    // #endregion
    console.error(`❌ Failed to start server: ${error.message}`);
    process.exit(1);
  }
};

startServer();
