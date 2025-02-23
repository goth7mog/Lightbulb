FROM python:3.12-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1
ENV PORT 8000

# Set work directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && \
    apt-get install -y --no-install-recommends gcc python3-dev libpq-dev && \
    rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip3 install --no-cache-dir -r requirements.txt gunicorn

# Copy project
COPY . .

# Expose port
EXPOSE $PORT

# Run application
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "--workers", "3", "your_project_name.wsgi:application"]
