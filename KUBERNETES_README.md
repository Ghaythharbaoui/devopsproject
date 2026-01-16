# Kubernetes Deployment Instructions

## Prerequisites
- Kubernetes cluster (Minikube, EKS, GKE, AKS, etc.)
- kubectl configured
- NGINX Ingress Controller installed (if using Ingress)

## Quick Deploy (Linux/Mac)
```bash
chmod +x deploy.sh
./deploy.sh
```

## Manual Deployment

1. **Apply the manifests:**
```bash
kubectl apply -f deployment.yaml
kubectl apply -f service.yaml
kubectl apply -f ingress.yaml
```

2. **Check deployment status:**
```bash
kubectl get pods
kubectl get services
kubectl get ingress
```

3. **Access the application:**

   **Option A: Using Ingress (with domain)**
   - Add to your `/etc/hosts`: `127.0.0.1 node-api.local`
   - Access: `http://node-api.local`

   **Option B: Using port-forward (for testing)**
   ```bash
   kubectl port-forward svc/node-api-service 3001:3001
   ```
   - Access: `http://localhost:3001`

## Scaling
The deployment is configured with 2 replicas. To scale:
```bash
kubectl scale deployment node-api-deployment --replicas=3
```

## Troubleshooting
- Check pod logs: `kubectl logs -l app=node-api`
- Check service: `kubectl describe service node-api-service`
- Check ingress: `kubectl describe ingress node-api-ingress`