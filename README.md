# Lightbulb Project

A Django-based web application containerized with Docker.

## Prerequisites

- Docker
- Docker Compose

## Quick Start

1. Clone the repository:
```bash
git clone <repository-url>
cd Lightbulb
```

2. Build and run the containers:
```bash
docker-compose up --build
```

3. Access the application at:
```
http://127.0.0.1:8001 or localhost:8001
http://127.0.0.1:8001/api
http://127.0.0.1:8001/api/swagger
```

## Environment Variables

The following environment variables can be adjusted in .env:

- `DEBUG`: Set to 1 for development
- `POSTGRES_DB`: Database name
- `POSTGRES_USER`: Database user
- `POSTGRES_PASSWORD`: Database password

## Dockerization

This project is containerized using Docker and Docker Compose for easy deployment and development.

### Docker Configuration

The project uses two main Docker configurations:

1. `Dockerfile`: Builds the Python/Django application image
   - Uses Python 3.12 slim base image
   - Installs system and Python dependencies
   - Sets up the application environment

2. `docker-compose.yml`: Orchestrates the application services
   - `web`: Django application service
     - Builds from Dockerfile
     - Maps container's internal port 8000 to outside 8001
     - Mounts code for development
     - Connects to PostgreSQL
   - `db`: PostgreSQL database service
     - Uses PostgreSQL 13
     - Persists data using Docker volumes
     - Configurable through environment variables

### Docker Commands

Common Docker operations:

```bash
# Build and start containers 
docker-compose up --build # (--build - for the first time then just 'docker-compose up' for the consecutive runs)

# Run in detached mode
docker-compose up -d

# [Important] Check the status of your containers
docker ps

# Stop and delete the containers
docker-compose down
```

### Database Management

When using Docker:
```bash
# Run migrations
docker-compose exec web python3 manage.py migrate

# Create superuser
docker-compose exec web python3 manage.py createsuperuser

# Access PostgreSQL shell
docker-compose exec db psql -U postgres -d lightbulb
```

## Development

To run migrations:
```bash
docker-compose exec web python3 manage.py migrate
```

To create a superuser:
```bash
docker-compose exec web python3 manage.py createsuperuser
```

## CI/CD Environment

This project includes a complete CI/CD environment with Jenkins, Harbor Registry, SonarQube, and Anchore Engine.

### Prerequisites for CI/CD
- Docker
- Docker Compose
- At least 8GB of free RAM
- 20GB of free disk space

### Starting CI/CD Environment

1. Navigate to CI/CD directory:
```bash
cd CI/CD
```

2. Start the CI/CD services:
```bash
docker-compose -f docker-compose-jenkins.yaml up -d
```

2. Access the services:
- Jenkins: http://localhost:8080
  - Initial admin password: `docker-compose exec jenkinspython cat /var/jenkins_home/secrets/initialAdminPassword`
- Harbor Registry: http://localhost:8081
  - Default credentials: admin/Harbor12345
- SonarQube: http://localhost:9000
  - Default credentials: admin/admin
- Anchore Engine: http://localhost:8228
  - API endpoint for vulnerability scanning

### Stopping CI/CD Environment

```bash
docker-compose -f docker-compose-jenkins.yaml down
```

### Common CI/CD Commands

```bash
# Check services status
cd CI/CD && docker-compose -f docker-compose-jenkins.yaml ps

# View logs
cd CI/CD && docker-compose -f docker-compose-jenkins.yaml logs -f [service_name]

# Restart specific service
cd CI/CD && docker-compose -f docker-compose-jenkins.yaml restart [service_name]

# Clean up everything including volumes
cd CI/CD && docker-compose -f docker-compose-jenkins.yaml down -v
```

## License

[Your chosen license]
