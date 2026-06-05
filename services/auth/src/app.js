require("dotenv").config();

const express = require("express");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const corsOptions = require("./config/cors");
const db = require("./models");
const authRoutes = require("./routes/authRoutes");

const app = express();
const PORT = process.env.PORT || 4001;

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: { error: 'Too many requests, please try again later' },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", authRoutes);

// Health check
app.get("/health", (_req, res) => res.json({ status: "ok", service: "auth" }));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({ 
    error: err.message || 'Internal server error' 
  });
});

async function start() {
  try {
    await db.sequelize.authenticate();
    console.log("✓ Database connected");

    // Sync database in development
    if (process.env.NODE_ENV === 'development') {
      await db.sequelize.sync({ alter: true });
      console.log("✓ Database synced");
    }

    app.listen(PORT, () => {
      console.log(`✓ Auth service running on port ${PORT}`);
    });
  } catch (err) {
    console.error("✗ Failed to start auth service:", err);
    process.exit(1);
  }
}

start();
