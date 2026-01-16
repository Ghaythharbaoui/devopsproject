# DevOps Project - Node.js API with Kubernetes

A comprehensive DevOps project demonstrating modern application development, containerization, CI/CD pipelines, and Kubernetes deployment with monitoring and observability.

## 📋 Table of Contents

- [Features](#features)
- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Local Development](#local-development)
- [Docker Setup](#docker-setup)
- [Kubernetes Deployment](#kubernetes-deployment)
- [CI/CD Pipeline](#cicd-pipeline)
- [API Documentation](#api-documentation)
- [Monitoring & Observability](#monitoring--observability)
- [Testing](#testing)
- [Contributing](#contributing)

## ✨ Features

- 🚀 **RESTful API** with Fibonacci calculations (recursive & dynamic programming)
- 📊 **Prometheus Metrics** for monitoring and alerting
- 🐳 **Docker Containerization** for consistent deployments
- ☸️ **Kubernetes Deployment** with 3 replicas and load balancing
- 🔒 **Security Scanning** (SAST with CodeQL, DAST with OWASP ZAP)
- 🧪 **Unit Testing** with Jest framework
- 📝 **Structured Logging** with JSON format and request tracing
- 🔄 **CI/CD Pipeline** with GitHub Actions
- 🌐 **Domain Access** via Kubernetes Ingress
- 📈 **Auto-scaling** ready infrastructure

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   GitHub Actions │    │     Docker Hub   │    │   Kubernetes    │
│   CI/CD Pipeline │───▶│   Container Reg  │───▶│   Cluster       │
│                 │    │                 │    │                 │
│ • Build & Test  │    │ • ghaythharbaoui │    │ • 3 Replicas    │
│ • SAST (CodeQL) │    │   /backe-end     │    │ • LoadBalancer  │
│ • DAST (ZAP)    │    │ • latest tag     │    │ • Ingress       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                                        │
                                                        ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Monitoring     │    │   Security       │    │   Access        │
│                 │    │                 │    │                 │
│ • Prometheus    │    │ • Request Trace  │    │ • localhost:80   │
│ • Metrics       │    │ • JSON Logs     │    │ • Custom Domain  │
│ • Health Checks │    │ • Error Handling│    │ • Load Balanced │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 📋 Prerequisites

- **Node.js** 18+ and npm
- **Docker** and Docker Compose
- **kubectl** configured for Kubernetes cluster
- **Git** for version control
- **GitHub Account** for CI/CD

### Optional for Full Setup:
- **Minikube** or **Kubernetes cluster** (EKS, GKE, AKS)
- **NGINX Ingress Controller** for domain access

## 🚀 Quick Start

### 1. Clone and Install
```bash
git clone https://github.com/Ghaythharbaoui/devopsproject.git
cd devopsproject
npm install
```

### 2. Run Locally
```bash
npm start
# Access at: http://localhost:3001
```

### 3. Run Tests
```bash
npm test
```

### 4. Docker Build
```bash
docker build -t devops-api .
docker run -p 3001:3001 devops-api
```

## 💻 Local Development

### Environment Setup
```bash
# Install dependencies
npm install

# Start development server
npm start

# Server runs on http://localhost:3001
```

### Development Commands
```bash
# Run tests
npm test

# Run tests in watch mode
npm test -- --watch

# Check code coverage
npm test -- --coverage
```

### Project Structure
```
devopsproject/
├── index.js              # Main application
├── package.json          # Dependencies and scripts
├── Dockerfile            # Container configuration
├── docker-compose.yml    # Local orchestration
├── deployment.yaml       # Kubernetes deployment
├── service.yaml          # Kubernetes service
├── ingress.yaml          # Domain routing
├── .github/workflows/    # CI/CD pipelines
│   └── main.yml
├── __tests__/            # Unit tests
│   └── index.test.js
└── KUBERNETES_README.md  # Deployment guide
```

## 🐳 Docker Setup

### Build and Run
```bash
# Build image
docker build -t devops-api .

# Run container
docker run -p 3001:3001 devops-api

# Or use docker-compose
docker-compose up -d
```

### Docker Commands
```bash
# View running containers
docker ps

# View logs
docker logs <container-id>

# Stop container
docker stop <container-id>

# Remove container
docker rm <container-id>
```

## ☸️ Kubernetes Deployment

### Prerequisites
```bash
# Install NGINX Ingress Controller (optional)
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.8.1/deploy/static/provider/cloud/deploy.yaml
```

### Deploy to Kubernetes
```bash
# Apply manifests
kubectl apply -f deployment.yaml
kubectl apply -f service.yaml
kubectl apply -f ingress.yaml

# Check deployment
kubectl get pods
kubectl get services
kubectl get ingress
```

### Access Application
```bash
# Port forward (alternative access)
kubectl port-forward svc/node-backend-service 3001:80

# Access via LoadBalancer
curl http://localhost/

# Or via Ingress domain (after DNS setup)
curl http://api.devops-project.local/
```

### Scaling
```bash
# Scale to 5 replicas
kubectl scale deployment node-backend-deployment --replicas=5

# Check scaling
kubectl get pods
```

## 🔄 CI/CD Pipeline

### GitHub Actions Workflow
The project includes a comprehensive CI/CD pipeline (`.github/workflows/main.yml`) with:

1. **Build & Test**: Node.js setup, dependency installation, basic health check
2. **Unit Tests**: Jest test execution
3. **SAST Security**: CodeQL analysis for code vulnerabilities
4. **DAST Security**: OWASP ZAP dynamic security scanning
5. **Docker Build**: Container build and push to Docker Hub

### Pipeline Stages
```yaml
Build & Test → Unit Tests → SAST → DAST → Docker Push
```

### Triggers
- Push to `main` branch
- Pull requests to `main` branch

### Security Gates
- ❌ Pipeline fails if unit tests fail
- ❌ Pipeline fails if security scans find critical issues
- ✅ Docker image only pushed after all checks pass

## 📚 API Documentation

### Base URL
- **Local**: `http://localhost:3001`
- **Kubernetes**: `http://localhost` (via LoadBalancer)
- **Domain**: `http://api.devops-project.local` (with DNS)

### Endpoints

#### GET `/`
Returns application information and health status.

**Response:**
```json
{
  "message": "Welcome to the DevOps Project API",
  "version": "1.0.0",
  "status": "healthy"
}
```

#### GET `/error`
Simulates an error response for testing.

**Response:** `500 Internal Server Error`

#### GET `/fib/recursion/:n`
Calculates Fibonacci number using recursive approach.

**Parameters:**
- `n` (integer): Fibonacci sequence position (0 ≤ n ≤ 40)

**Example:** `GET /fib/recursion/10`

**Response:**
```json
{
  "method": "recursion",
  "n": 10,
  "result": 55,
  "trace_id": "unique-request-id"
}
```

#### GET `/fib/dp/:n`
Calculates Fibonacci number using dynamic programming (efficient).

**Parameters:**
- `n` (integer): Fibonacci sequence position (n ≥ 0)

**Example:** `GET /fib/dp/20`

**Response:**
```json
{
  "method": "dp",
  "n": 20,
  "result": 6765,
  "trace_id": "unique-request-id"
}
```

#### GET `/metrics`
Returns Prometheus metrics for monitoring.

**Response:** Prometheus format metrics including:
- HTTP request counts and durations
- Node.js performance metrics
- Garbage collection statistics
- System resource usage

### Error Responses
```json
{
  "error": "n must be a non-negative integer"
}
```

### Request Tracing
All responses include a unique `trace_id` for request tracking across logs and metrics.

## 📊 Monitoring & Observability

### Metrics Endpoint
Access Prometheus metrics at `/metrics`:
```bash
curl http://localhost/metrics
```

### Key Metrics
- **Request Count**: `http_request_total{method="GET", route="/fib/dp/:n"}`
- **Response Time**: `http_request_duration_seconds`
- **System Health**: CPU, memory, GC statistics
- **Application Health**: Request success/failure rates

### Logging Format
All logs are structured JSON:
```json
{
  "timestamp": "2026-01-16T10:30:00.000Z",
  "level": "info",
  "trace_id": "unique-request-id",
  "method": "GET",
  "path": "/fib/dp/10",
  "status": 200,
  "duration": 0.015,
  "message": "Fibonacci (DP) computed"
}
```

### Health Checks
- Application reports `"status": "healthy"` on root endpoint
- Kubernetes performs automatic pod health checks
- Load balancer distributes traffic only to healthy pods

## 🧪 Testing

### Unit Tests
```bash
# Run all tests
npm test

# Run with coverage
npm test -- --coverage

# Run specific test file
npm test -- __tests__/index.test.js
```

### Test Coverage
- ✅ Fibonacci recursive implementation
- ✅ Fibonacci dynamic programming implementation
- ✅ Input validation (negative numbers, invalid types)
- ✅ Edge cases (n=0, n=1)
- ✅ Performance validation

### Integration Testing
```bash
# Test all endpoints
curl http://localhost/
curl http://localhost/fib/dp/10
curl http://localhost/fib/recursion/8
curl http://localhost/metrics
```

## 🤝 Contributing

### Development Workflow
1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/new-feature`
3. **Make** your changes and add tests
4. **Run** tests: `npm test`
5. **Commit** changes: `git commit -am 'Add new feature'`
6. **Push** to branch: `git push origin feature/new-feature`
7. **Create** Pull Request

### Code Standards
- Use ESLint configuration
- Write comprehensive unit tests
- Follow conventional commit messages
- Update documentation for API changes

### Pull Request Requirements
- ✅ All tests pass
- ✅ Code coverage maintained
- ✅ Documentation updated
- ✅ Security scan passes
- ✅ No breaking changes without discussion

## 📄 License

ISC License - see LICENSE file for details.

## 👥 Authors

- **Ghayth Harbaoui** - *Initial work* - [GitHub](https://github.com/Ghaythharbaoui)

## 🙏 Acknowledgments

- Node.js community for excellent runtime
- Express.js for web framework
- Prometheus for metrics collection
- Kubernetes for container orchestration
- GitHub Actions for CI/CD platform
- OWASP ZAP for security testing

---

**Happy Coding! 🚀**

For questions or issues, please open a GitHub issue or contact the maintainers.