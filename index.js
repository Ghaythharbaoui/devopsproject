const express = require('express');
const app = express();
const client = require('prom-client');
const PORT = process.env.PORT || 3000;

app.get('/hello', (req, res) => {
  res.json({ message: 'Hello World 👋' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
const httpRequestDuration = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests',
  labelNames: ['method', 'route', 'status'],
});

// Middleware to measure request time
app.use((req, res, next) => {
  const end = httpRequestDuration.startTimer();
  res.on('finish', () => {
    end({
      method: req.method,
      route: req.path,
      status: res.statusCode,
    });
  });
  next();
});

// Metrics endpoint
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', client.register.contentType);
  res.end(await client.register.metrics());
});