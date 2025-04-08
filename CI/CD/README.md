# CI/CD Environment (amd/arm support)

This directory contains the CI/CD environment setup with Jenkins, Harbor Registry, SonarQube, and Grype vulnerability scanner.

## How to run CI/CD Environment

1. Navigate to CI/CD directory:
```bash
cd CI/CD
```

2. Start the CI/CD services:
```bash
docker-compose up
```

3. Access the services:
- Jenkins: http://localhost:8080
  - Initial admin password: `docker exec -it jenkins cat /var/jenkins_home/secrets/initialAdminPassword`

- Harbor Portal: http://localhost:8085
  - Credentials: admin/habr111

- SonarQube: http://localhost:9000
  - Default credentials: admin/admin

- Grype is available as a container vulnerability scanner (replacing Anchore Engine)

## Stopping CI/CD Environment

```bash
docker-compose down
```

## Harbor Configuration

Harbor is configured with the following components:
- Core services
- Registry
- Portal
- PostgreSQL database
- Redis cache
- Harb jobservice (remains to be connected)



## Using Grype Vulnerability Scanner

Grype is a modern container vulnerability scanner that can analyze Docker images for security vulnerabilities. It replaces Anchore Engine in this CI/CD pipeline.

### Scanning Images with Grype

To scan a Docker image for vulnerabilities:

```bash
docker exec -it grype grype <image-name>:<tag>
```

For example, to scan your application image:

```bash
docker exec -it grype grype your-registry/banking-app:latest
```

### Grype Output

Grype will provide a comprehensive list of vulnerabilities found, including:
- CVE identifiers
- Severity levels (Critical, High, Medium, Low)
- Package information
- Fix availability

### Integrating Grype in CI/CD Pipeline

In your Jenkinsfile, you can add a vulnerability scanning stage:

```groovy
stage('Vulnerability Scan') {
    steps {
        sh 'docker exec grype grype your-registry/banking-app:${BUILD_NUMBER} --fail-on high'
    }
}
```

This will fail the build if high severity vulnerabilities are found.

## Create a Jenkins build
  New Item -> Multibranch Pipeline ->
  1) Branch Sources (Add source - Single repository & branch, Source Code Management - Git, Repository URL - <github url>, Credentials - Add - Jenkins - Kind (SSH Username with private key), Username - git, Private Key - your private ssh key, Branches to build - Branch Specifier - */main, Repository Browser - Auto, Property strategy - All branches get the same properties)
  2) Build Configuration (Mode - by Jenkinsfile, Script Path - Jenkinsfile)
  3) Scan Multibranch Pipeline Triggers (Periodically if not otherwise run, Interval - <your value>)
  4) Save
  5) Check for Console output logs



