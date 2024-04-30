const express = require('express');
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('map_cache.db');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());

// API endpoint to store map tile in the database
app.post('/api/map-tile', (req, res) => {
  const { zoom, x, y, tileData } = req.body;
  db.run('INSERT INTO map_tiles (zoom, x, y, tile_data) VALUES (?, ?, ?, ?)', [zoom, x, y, tileData], (err) => {
    if (err) {
      console.error('Error storing map tile:', err.message);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      console.log('Map tile stored successfully');
      res.status(200).json({ message: 'Map tile stored successfully' });
    }
  });
});

// API endpoint to retrieve map tile from the database
app.get('/api/map-tile/:zoom/:x/:y', (req, res) => {
  const { zoom, x, y } = req.params;
  db.get('SELECT tile_data FROM map_tiles WHERE zoom = ? AND x = ? AND y = ?', [zoom, x, y], (err, row) => {
    if (err) {
      console.error('Error retrieving map tile:', err.message);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      const tileData = row ? row.tile_data : null;
      res.status(200).json({ tileData });
    }
  });
});

app.listen(5000, () => {
  console.log('Server is running on port 5000');
});
