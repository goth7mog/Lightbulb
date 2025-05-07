FROM jenkins/jenkins:lts

USER root

# Update and install dependencies
RUN apt-get update && \
    apt-get install -y apt-transport-https ca-certificates curl gnupg lsb-release

# Install tini if not already present
RUN apt-get update && \
    apt-get install -y tini && \
    rm -rf /var/lib/apt/lists/*

# Install Docker using the official Docker installation script instead of apt
RUN curl -fsSL https://get.docker.com -o get-docker.sh && \
    sh get-docker.sh && \
    usermod -aG docker jenkins && \
    # Fix Docker socket permissions
    chmod 666 /var/run/docker.sock || true

# Install Python and other tools
RUN apt-get install -y python3 python3-pip python3.11-venv && \
    ln -s /usr/bin/python3 /usr/bin/python

# Install SonarQube Scanner that matches your architecture (ARM64)
# RUN mkdir -p /opt/sonar-scanner && \
#     cd /opt/sonar-scanner && \
#     curl -sSLo sonar-scanner.zip https://binaries.sonarsource.com/Distribution/sonar-scanner-cli/sonar-scanner-cli-5.0.1.3006-linux-aarch64.zip && \
#     unzip sonar-scanner.zip && \
#     rm sonar-scanner.zip && \
#     ln -s /opt/sonar-scanner/sonar-scanner-*/bin/sonar-scanner /usr/local/bin/sonar-scanner

# Switch back to jenkins user
USER jenkins

# Note: After starting the Jenkins container, you may need to run:
# docker exec -it jenkins bash -c "chmod 666 /var/run/docker.sock"