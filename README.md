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

### About Gunicorn

Gunicorn ("Green Unicorn") is a Python WSGI HTTP Server for UNIX used to serve Python web applications. It:
- Acts as a bridge between Nginx and Django
- Handles Python application processes
- Manages worker processes for better performance
- Is more robust than Django's development server
- Recommended for production deployments

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

## License

[Your chosen license]
