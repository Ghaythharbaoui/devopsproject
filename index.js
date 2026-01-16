const express = require('express');
const { v4: uuidv4 } = require('uuid');
const client = require('prom-client');

const app = express();
const port = 3001;

// --- CONFIGURATION OBSERVABILITÉ (METRICS) ---
// Création d'un registre Prometheus
const register = new client.Registry();
client.collectDefaultMetrics({ register });

// Métrique personnalisée 1 : Compteur de requêtes
const httpRequestCount = new client.Counter({
  name: 'http_request_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code'],
});
register.registerMetric(httpRequestCount);

// Métrique personnalisée 2 : Histogramme de latence
const httpRequestDuration = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.1, 0.5, 1, 1.5],
});
register.registerMetric(httpRequestDuration);

// --- MIDDLEWARE GLOBAL (Tracing + Logging + Metrics) ---
app.use((req, res, next) => {
  // 1. TRACING : Générer un ID unique pour chaque requête
  const traceId = uuidv4();
  req.traceId = traceId;
  
  // Ajouter le Trace ID dans les headers de réponse (Preuve pour le rapport)
  res.setHeader('X-Trace-ID', traceId);

  const start = Date.now();

  // On écoute la fin de la requête pour logger et mesurer
  res.on('finish', () => {
    // Calcul de la durée
    const duration = (Date.now() - start) / 1000;
    const route = req.route ? req.route.path : req.path;

    // 2. METRICS : Mise à jour de Prometheus
    httpRequestCount.inc({ method: req.method, route: route, status_code: res.statusCode });
    httpRequestDuration.observe({ method: req.method, route: route, status_code: res.statusCode }, duration);

    // 3. LOGS : Format JSON structuré
    const logData = {
      timestamp: new Date().toISOString(),
      level: res.statusCode >= 400 ? 'error' : 'info',
      trace_id: traceId,
      method: req.method,
      path: req.originalUrl,
      status: res.statusCode,
      duration: duration,
      message: "HTTP Request processed"
    };
    
    // Afficher dans la console (stdout)
    console.log(JSON.stringify(logData));
  });

  next();
});

// --- ROUTES DE L'API ---

app.get('/', (req, res) => {
  res.json({ 
    message: "Welcome to the DevOps Project API", 
    version: "1.0.0",
    status: "healthy"
  });
});

// Route pour simuler une erreur (utile pour montrer les logs d'erreur)
app.get('/error', (req, res) => {
  res.status(500).json({ error: "Internal Server Error Simulation" });
});

// ------- FIBONACCI ENDPOINTS -------
// Recursive implementation (not recommended for large n)
function fibRec(n) {
  if (n < 0) return null;
  if (n <= 1) return n;
  return fibRec(n - 1) + fibRec(n - 2);
}

// Dynamic programming (iterative) implementation
function fibDP(n) {
  if (n < 0) return null;
  if (n <= 1) return n;
  let a = 0, b = 1;
  for (let i = 2; i <= n; i++) {
    const tmp = a + b;
    a = b;
    b = tmp;
  }
  return b;
}

// Endpoint: recursion approach (example: /fib/recursion/7)
app.get('/fib/recursion/:n', (req, res) => {
  const n = parseInt(req.params.n, 10);
  if (Number.isNaN(n) || n < 0) return res.status(400).json({ error: 'n must be a non-negative integer' });
  if (n > 40) return res.status(413).json({ error: 'n too large for recursive method' });

  const start = Date.now();
  const result = fibRec(n);
  const duration = (Date.now() - start) / 1000;

  console.log(JSON.stringify({
    timestamp: new Date().toISOString(),
    level: 'info',
    trace_id: req.traceId,
    endpoint: '/fib/recursion/:n',
    method: req.method,
    n: n,
    result: result,
    duration: duration,
    message: 'Fibonacci (recursion) computed'
  }));

  res.json({ method: 'recursion', n: n, result: result, trace_id: req.traceId });
});

// Endpoint: DP approach (example: /fib/dp/7)
app.get('/fib/dp/:n', (req, res) => {
  const n = parseInt(req.params.n, 10);
  if (Number.isNaN(n) || n < 0) return res.status(400).json({ error: 'n must be a non-negative integer' });

  const start = Date.now();
  const result = fibDP(n);
  const duration = (Date.now() - start) / 1000;

  console.log(JSON.stringify({
    timestamp: new Date().toISOString(),
    level: 'info',
    trace_id: req.traceId,
    endpoint: '/fib/dp/:n',
    method: req.method,
    n: n,
    result: result,
    duration: duration,
    message: 'Fibonacci (DP) computed'
  }));

  res.json({ method: 'dp', n: n, result: result, trace_id: req.traceId });
});

// --- ENDPOINT METRICS (Requis pour l'observabilité) ---
app.get('/metrics', async (req, res) => {
  res.setHeader('Content-Type', register.contentType);
  res.send(await register.metrics());
});

// --- DÉMARRAGE DU SERVEUR ---
if (require.main === module) {
  app.listen(port, () => {
    console.log(JSON.stringify({ 
      level: 'info', 
      message: `Server running on port ${port}`, 
      timestamp: new Date().toISOString() 
    }));
  });
}

// Export functions for testing
module.exports = {
  fibRec,
  fibDP
};