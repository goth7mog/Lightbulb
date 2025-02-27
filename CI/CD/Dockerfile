FROM jenkins/jenkins:lts

# Switch to root to install packages
USER root

# Update package lists and install Python 3 and pip
RUN apt-get update && \
    apt-get install -y python3 python3-pip && \
    apt-get install -y python3.11-venv && \
    ln -s /usr/bin/python3 /usr/bin/python

# Switch back to the Jenkins user
USER jenkins
