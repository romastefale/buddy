import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const AVATAR_DIR = path.join(__dirname, 'avatar');
const IMAGE_EXT_REGEX = /\.(png|jpe?g|webp|gif|svg|avif)$/i;

app.get('/api/avatars', (req, res) => {
  try {
    if (!fs.existsSync(AVATAR_DIR)) {
      return res.json({ files: [] });
    }
    const files = fs
      .readdirSync(AVATAR_DIR)
      .filter((file) => IMAGE_EXT_REGEX.test(file))
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }));
    res.json({ files });
  } catch (err) {
    res.status(500).json({ files: [] });
  }
});

app.use(express.static(__dirname));
app.use('/avatar', express.static(AVATAR_DIR));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Guardiões Virtuais server running on http://0.0.0.0:${PORT}`);
});
