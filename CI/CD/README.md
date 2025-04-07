# Harbor Registry Setup

This directory contains the configuration for a Harbor container registry.

## Configuration Files

- `docker-compose.yml` - Defines all Harbor services
- `harbor.yml` - Main Harbor configuration file
- `.env` - Environment variables for Harbor

## Starting Harbor

```bash
docker-compose up -d
```

## Accessing Harbor

Once started, you can access Harbor at:
- URL: http://localhost:8081
- Username: admin
- Password: Harbor12345 (defined in .env file)

## Services

- **harbor-portal**: Web UI for Harbor
- **harbor-core**: Core service that handles API requests
- **harbor-db**: PostgreSQL database
- **harbor-registry**: Docker registry component
- **harbor-jobservice**: Handles jobs like replication and scanning

## Common Issues

If you encounter errors when starting Harbor, check:
1. Port conflicts on 8081
2. Permission issues with mounted volumes
3. Database connection errors
