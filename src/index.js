import express from 'express';
import env from 'dotenv';
import cors from 'cors';
import router from './routes';
import bodyParser from 'body-parser';

env.config();

const app = express();
const PORT = process.env.PORT || 3000;

//  CORS
const corsOptions = {
  origin: '*',
  credentials: true,
};
app.use(cors(corsOptions));

app.use(express.static('public'));

// Body parser
app.use(
  express.json({
    limit: '150mb',
  })
);
app.use(
  express.urlencoded({
    extended: true,
    limit: '150mb',
  })
);

// Routes
router(app);

app.get('/', (req, res) => {
  return res.json({ message: 'Hello World' });
});

// 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

app.use((err, req, res, next) => {
  console.error('🔥 Server Error:', err);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

app
  .listen(PORT, () => {
    console.log(`
      =========================================
              COOKED IN PORT ${PORT} 😎
      =========================================
    `);
  })
  .on('error', (err) => {
    console.error(`Error starting server: ${err.message}`);
  });
