# Banking App Project

A Django-based banking web application deployed on Kubernetes.

## Prerequisites

- Kubernetes cluster (Docker Desktop Kubernetes)
- kubectl
- Docker

## Quick Start

1. Clone the repository:
```bash
git clone <repository-url>
cd Lightbulb
```

2. Build the local image:
```bash
docker build -t lightbulb-web:latest .
```

3. Deploy to Kubernetes:
```bash
kubectl apply -f k8s/
```

4. Access the application:
   - Open http://localhost:80 in your browser
   - API available at http://localhost:80/api
   - Swagger UI at http://localhost:80/api/swagger

## Environment Variables

The following environment variables are configured in Kubernetes ConfigMap:

- `DEBUG`: Set to 1 for development
- `POSTGRES_DB`: Database name
- `POSTGRES_USER`: Database user
- `POSTGRES_PASSWORD`: Database password

## Architecture

The project uses a three-tier architecture:
- Nginx: Reverse proxy
- Django: Application server (Gunicorn)
- PostgreSQL: Database

## Container Configuration

The project uses a Dockerfile to build the Django application image:
- Uses Python 3.12 slim base image
- Installs system and Python dependencies
- Sets up the application environment
- Runs Gunicorn as the application server

### Nginx Configuration

Nginx serves as a reverse proxy and handles:
- Load balancing
- Request forwarding to Django application
- Simple and efficient request handling

## Kubernetes Configuration

The application is deployed using several Kubernetes resources:
- Deployments for web, database, and nginx
- Services for networking
- ConfigMaps for configuration
- PersistentVolumeClaim for database storage

### Common kubectl Commands

```bash
# View all resources
kubectl get all

# Check pod logs
kubectl logs <pod-name>

# Scale deployment
kubectl scale deployment banking-app-web --replicas=5

# Apply database migrations
kubectl exec -it <web-pod-name> -- python manage.py migrate

# Create superuser
kubectl exec -it <web-pod-name> -- python manage.py createsuperuser

# Access PostgreSQL shell
kubectl exec -it <db-pod-name> -- psql -U postgres -d banking-app
```

## Development

To run migrations:
```bash
kubectl exec -it <web-pod-name> -- python manage.py migrate
```

To create a superuser:
```bash
kubectl exec -it <web-pod-name> -- python manage.py createsuperuser
```

## Monitoring Setup

The application includes Prometheus and Grafana for monitoring:

1. Deploy monitoring namespace and components:
```bash
kubectl apply -f k8s/monitoring/namespace.yaml
kubectl apply -f k8s/monitoring/
```

2. Access monitoring dashboards:
   - Prometheus: http://localhost:30090
   - Grafana: http://localhost:30030

### Grafana Initial Setup
- Login with:
  - Username: admin
  - Password: admin
- The Prometheus datasource is pre-configured
- Import dashboard ID 12740 for Django monitoring

### Monitoring Features
- Application metrics via Prometheus
- Pre-configured Grafana dashboards
- Real-time performance monitoring
- Resource usage tracking
- Custom metrics for banking operations

### Useful Monitoring Commands
```bash
# Check monitoring pods
kubectl get pods -n monitoring

# View Prometheus logs
kubectl logs -n monitoring $(kubectl get pods -n monitoring | grep prometheus | awk '{print $1}')

# View Grafana logs
kubectl logs -n monitoring $(kubectl get pods -n monitoring | grep grafana | awk '{print $1}')

# Port-forward Prometheus (alternative access)
kubectl port-forward -n monitoring svc/prometheus 9090:9090

# Port-forward Grafana (alternative access)
kubectl port-forward -n monitoring svc/grafana 3000:3000
```

## License

[Your chosen license]
