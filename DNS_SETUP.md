# DNS Setup Guide for Kubernetes Deployment

## Current Status
✅ **Scaled to 3 replicas** - Load balancing across 3 pods
✅ **LoadBalancer service active** - Direct access on port 80
⚠️ **Ingress controller** - Still initializing (may take 5-10 minutes)

## DNS Configuration Options

### Option 1: Local DNS (Development)
Add to your `/etc/hosts` file:
```
127.0.0.1 api.devops-project.local
```

Then access: `http://api.devops-project.local`

### Option 2: Production DNS
For production deployment:

1. **Get LoadBalancer IP:**
   ```bash
   kubectl get services
   # Look for EXTERNAL-IP of node-backend-service
   ```

2. **Configure DNS:**
   - Point your domain (e.g., `api.yourdomain.com`) to the LoadBalancer IP
   - Or use a cloud DNS service (Route53, Cloudflare, etc.)

3. **Update Ingress:**
   Change `node-api.local` in `ingress.yaml` to your actual domain

## Testing Current Setup

Your app is accessible at:
- `http://localhost/` (direct LoadBalancer access)
- `http://localhost/fib/dp/10` (Fibonacci endpoint)
- `http://localhost/metrics` (Prometheus metrics)

## Monitoring Scaling

Check pod distribution:
```bash
kubectl get pods -o wide
kubectl top pods  # Resource usage
```

## Load Testing

Test load balancing across 3 replicas:
```bash
# Multiple requests to see different pods handling traffic
for i in {1..10}; do curl -s http://localhost/ | grep trace_id; done
```