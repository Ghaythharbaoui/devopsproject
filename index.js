const express = require('express');
const { v4: uuidv4 } = require('uuid');
const client = require('prom-client'); // Pour les métriques

const app = express();
const port = 3000;

// --- 1. CONFIGURATION DES MÉTRIQUES (Prometheus) ---
// Crée un registre pour stocker les métriques
const register = new client.Registry();
client.collectDefaultMetrics({ register }); // Ajoute les métriques par défaut (CPU, RAM...)

// Métrique personnalisée : Compteur de requêtes
const httpRequestCount = new client.Counter({
  name: 'http_request_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code'],
});
register.registerMetric(httpRequestCount);

// Métrique personnalisée : Histogramme de latence
const httpRequestDuration = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.1, 0.5, 1, 1.5],
});
register.registerMetric(httpRequestDuration);

// --- MIDDLEWARE D'OBSERVABILITÉ (S'exécute à chaque requête) ---
app.use((req, res, next) => {
  // 2. TRACING : Générer un ID unique
  const traceId = uuidv4();
  req.traceId = traceId;
  
  // Ajouter le Trace ID dans les headers de réponse (bonnes pratiques)
  res.setHeader('X-Trace-ID', traceId);

  // Chronomètre pour la latence
  const start = Date.now();

  // Écouter l'événement 'finish' (quand la réponse est envoyée)
  res.on('finish', () => {
    const duration = (Date.now() - start) / 1000; // en secondes
    const route = req.route ? req.route.path : req.path;

    // Mise à jour des métriques Prometheus
    httpRequestCount.inc({ method: req.method, route: route, status_code: res.statusCode });
    httpRequestDuration.observe({ method: req.method, route: route, status_code: res.statusCode }, duration);

    // 3. LOGS STRUCTURÉS (JSON)
    const logData = {
      timestamp: new Date().toISOString(),
      level: res.statusCode >= 400 ? 'error' : 'info',
      trace_id: traceId,      // Lien vers le tracing [cite: 14]
      method: req.method,
      path: req.originalUrl,
      status: res.statusCode,
      duration: duration,
      message: "Request processed"
    };
    
    // On imprime en JSON stringifié (pas de console.log "texte")
    console.log(JSON.stringify(logData));
  });

  next();
});

// --- TES ROUTES ---

app.get('/', (req, res) => {
  res.json({ message: "Hello DevOps!", status: "OK" });
});

// Endpoint pour générer une erreur (pour tester les logs d'erreur)
app.get('/error', (req, res) => {
  res.status(500).json({ error: "Oups, une erreur simulée" });
});

// --- ENDPOINT MÉTRIQUES ---
// C'est ici que Prometheus viendra lire les données [cite: 12]
app.get('/metrics', async (req, res) => {
  res.setHeader('Content-Type', register.contentType);
  res.send(await register.metrics());
});

app.listen(port, () => {
  // Log de démarrage en JSON aussi pour la cohérence
  console.log(JSON.stringify({ level: 'info', message: `Server running on port ${port}` }));
});