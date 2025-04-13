# Lightbulb Project

- BACKEND - Python Django
- FRONTEND - React with Typescript & Vite for local development

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
# Build the Docker image locally first
docker build -t bank .

# Run it
docker-compose up --build
```

3. First-time setup only:
```bash
# Run migrations (only needed on first setup or when models change)
docker-compose exec web python3 manage.py migrate

# Create superuser (only needed once for admin access)
docker-compose exec web python3 manage.py createsuperuser
```

4. Now you can access the backend at:
```
http://127.0.0.1:8001 or localhost:8001
http://127.0.0.1:8001/api
http://127.0.0.1:8001/api/swagger
```
And frontend at (login with your superuser credentials created previously):
```
http://127.0.0.1:3000 
```

4. Access Django panel:
```
http://127.0.0.1:8001/admin
```

6. The UI for sql database is available at:
```
http://127.0.0.1:5050
```

7. Shut all the services down:
```
docker-compose down 
```

## Environment Variables

The following environment variables can be adjusted in .env:

- `DEBUG`: Set to 1 for development
- `BACKEND_PORT`: Port allocated for the Django app


### Docker Configuration

The project uses following Docker configurations:

1. `Dockerfile`: Builds the Python/Django application image
   - Uses Python 3.12 slim base image
   - Installs system and Python dependencies
   - Sets up the application environment

2. `frontend/Dockerfile`: Builds the React application image
   - Uses node:18-alpine as a base image
   - Serves frontend files
   - Vite for seamless local development

3. `docker-compose.yml`: Orchestrates the application services
   - `web`: Django application service
     - Builds from Dockerfile
     - Maps container's internal port 8000 to outside 8001
     - Mounts code for development
     - Connects to PostgreSQL
   - `frontend`: React App on Typescript
   - `sqlite-browser`: Web-based SQLite database browser
     - Provides a UI to browse the SQLite database
     - Available at port 5050

## CI/CD Environment

Check README inside the corresponding folder


## License

[Your chosen license]
