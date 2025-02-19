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
http://localhost:8000
```

## Project Structure

```
Lightbulb/
├── Dockerfile
├── docker-compose.yml
├── manage.py
└── requirements.txt
```

## Environment Variables

The following environment variables can be adjusted in docker-compose.yml:

- `DEBUG`: Set to 1 for development
- `POSTGRES_DB`: Database name
- `POSTGRES_USER`: Database user
- `POSTGRES_PASSWORD`: Database password

## Dockerization

This project is containerized using Docker and Docker Compose for easy deployment and development.

### Docker Configuration

The project uses two main Docker configurations:

1. `Dockerfile`: Builds the Python/Django application image
   - Uses Python 3.9 slim base image
   - Installs system and Python dependencies
   - Sets up the application environment
   - Exposes port 8000 for the Django development server

2. `docker-compose.yml`: Orchestrates the application services
   - `web`: Django application service
     - Builds from Dockerfile
     - Maps port 8000
     - Mounts code for development
     - Connects to PostgreSQL
   - `db`: PostgreSQL database service
     - Uses PostgreSQL 13
     - Persists data using Docker volumes
     - Configurable through environment variables

### Docker Commands

Common Docker operations:

```bash
# Build and start services
docker-compose up --build

# Run in detached mode
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Remove volumes (caution: deletes database data)
docker-compose down -v
```

### Database Management

When using Docker:
```bash
# Run migrations
docker-compose exec web python manage.py migrate

# Create superuser
docker-compose exec web python manage.py createsuperuser

# Access PostgreSQL shell
docker-compose exec db psql -U postgres -d lightbulb
```

## Development

To run migrations:
```bash
docker-compose exec web python manage.py migrate
```

To create a superuser:
```bash
docker-compose exec web python manage.py createsuperuser
```

## License

[Your chosen license]
