#!/bin/bash
# This script installs Harbor's self-signed certificate into Docker's trust store

# The purpose of this script is to allow Docker to securely connect to your private Harbor registry
# that's running with a self-signed certificate. Without this configuration, Docker would reject
# the connection to Harbor with "x509: certificate signed by unknown authority" errors.

# NOTE: This script is necessary to run BEFORE setting up the Jenkins pipeline
# if you're planning to push to Harbor registry from Jenkins.
#
# For a successful Jenkins build that pushes to Harbor:
#
# 1. You must run this script on the Jenkins host machine (where the Docker daemon runs)
# 2. Without this certificate configuration, the Jenkins pipeline will fail at the 
#    "Push to Harbor Registry" stage with certificate validation errors
# 3. If Jenkins is running in a container, you may need to:
#    - Mount the Docker socket (/var/run/docker.sock)
#    - Run this script inside the Jenkins container
#    - OR configure the certificate on the host machine running the Jenkins container
#
# Special case for Jenkins running in Docker with Docker Pipeline plugin:
#
# Since you're running Jenkins in a Docker container AND using the Docker Pipeline plugin:
#
# 1. The Docker commands in your Jenkinsfile are executed by the Docker daemon on the host machine,
#    not inside the Jenkins container itself
#
# 2. Therefore, you need to run this script on the HOST MACHINE where both the Jenkins container
#    and the Docker daemon are running
#
# 3. Make sure the Docker socket is properly mounted to your Jenkins container in docker-compose.yml:
#    volumes:
#      - /var/run/docker.sock:/var/run/docker.sock
#
# 4. If you're using Docker-in-Docker, the certificate needs to be installed in both Docker environments
#
# If you're experiencing "x509: certificate signed by unknown authority" errors in your
# Jenkins build logs, it means this certificate setup is needed.

# Create directory for Harbor certificate if it doesn't exist
# On macOS, Docker Desktop uses a different location for certificates
if [[ "$OSTYPE" == "darwin"* ]]; then
  # macOS certificate location
  DOCKER_CERT_DIR=~/Library/Containers/com.docker.docker/Data/docker/certs.d/localhost:8085
  mkdir -p "$DOCKER_CERT_DIR"
  
  # Copy the certificate to the Docker certificates directory
  cp ./harbor_config/ssl/ca.crt "$DOCKER_CERT_DIR/ca.crt"
  
  # For macOS, restart Docker Desktop
  echo "Please restart Docker Desktop to apply certificate changes"
  osascript -e 'quit app "Docker"'
  echo "Wait a few seconds, then start Docker Desktop again"
else
  # Linux certificate location
  DOCKER_CERT_DIR=/etc/docker/certs.d/localhost:8085
  mkdir -p $DOCKER_CERT_DIR
  
  # Copy the certificate to the Docker certificates directory
  cp ./harbor_config/ssl/ca.crt $DOCKER_CERT_DIR/ca.crt
  
  # Restart Docker to apply changes
  systemctl restart docker || service docker restart || echo "Please restart Docker manually"
fi

echo "Harbor certificate installed for Docker. If Docker was not restarted automatically, please restart it manually."

# After running this script, you should be able to:
# 1. Login to your Harbor registry: docker login localhost:8085
# 2. Push images: docker push localhost:8085/library/your-image:tag
# 3. Pull images: docker pull localhost:8085/library/your-image:tag
# without certificate validation errors
