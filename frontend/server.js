const express = require('express');
const path = require('path');
const fetch = require('node-fetch');           

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/formulas', async (req, res, next) => {
  try {
    const upstream = await fetch('http://localhost:8000/api/formulas/');
    if (!upstream.ok) {
      return res
        .status(upstream.status)
        .send(`Upstream error ${upstream.status}`);
    }
    const data = await upstream.json();
    res.json(data);
  } catch (err) {
    next(err);
  }
});

app.get(['/api/formulas/:id'], async (req, res, next) => {
  try {
    const upstream = await fetch(`http://localhost:8000/api/formulas/${req.params.id}/`);
    if (!upstream.ok) {
      return res.status(upstream.status).send(`Upstream error ${upstream.status}`);
    }
    const data = await upstream.json();
    res.json(data);
  } catch (err) {
    next(err);
  }
});


app.get('/formula/:id', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'detail.html'));
});

app.delete('/api/formulas/:id', async (req, res, next) => {
  try {
    const upstream = await fetch(`http://localhost:8000/api/formulas/${req.params.id}/`, {
      method: 'DELETE'
    });
    res.sendStatus(upstream.status);
  } catch (err) {
    next(err);
  }
});



app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
