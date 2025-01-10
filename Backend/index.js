const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 5000;
app.use(cors());
app.get('/api/data', (req, res) => {
  const filePath = path.join(__dirname, '../financial_data.json');

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading data:', err);
      res.status(500).json({ error: 'Error reading data' });
      return;
    }

    try {
      const jsonData = JSON.parse(data);
      res.json(jsonData);
    } catch (parseErr) {
      console.error('Error parsing JSON data:', parseErr);
      res.status(500).json({ error: 'Error parsing JSON data' });
    }
  });
});
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
