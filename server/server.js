const path = require('path');
const fs = require('fs');
const envPath = path.resolve(__dirname, '.env');
require('dotenv').config({ path: envPath });
// Fallback: read RESEND_API_KEY from .env if dotenv didn't set it (e.g. encoding/BOM)
if (!process.env.RESEND_API_KEY && fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, 'utf8').replace(/^\uFEFF/, '');
  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (trimmed.startsWith('RESEND_API_KEY=')) {
      const value = trimmed.slice(15).trim().replace(/^["']|["']$/g, '');
      if (value) process.env.RESEND_API_KEY = value;
      break;
    }
  }
}
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/', authRoutes);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Not found' });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ success: false, message: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
