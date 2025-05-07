pipeline {
    agent any

    environment {
        VENV = 'venv'
        IMAGE_NAME = 'banking-app'
        HARBOR_REGISTRY = 'localhost:8085'
        HARBOR_PROJECT = 'library'
        IMAGE_TAG = "${env.BUILD_NUMBER}"
        SONAR_PROJECT_KEY = 'banking-app'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Setup Python Environment') {
            steps {
                // Create a virtual environment using python3.
                sh 'python3 -m venv ${VENV}'
                // Create a symlink so that "python" points to "python3" within the venv.
                sh 'ln -sf $(which python3) ${VENV}/bin/python'
                // Activate the virtual environment and upgrade pip.
                sh '. ${VENV}/bin/activate && pip install --upgrade pip'
            }
        }
        
        stage('Install Dependencies') {
            steps {
                // Activate the virtual environment and install requirements.
                sh '. ${VENV}/bin/activate && pip install -r requirements.txt'
            }
        }
        
        stage('Apply Migrations') {
            steps {
                // Run Django migrations.
                sh '. ${VENV}/bin/activate && python manage.py migrate'
            }
        }
        
        stage('Run Tests') {
            steps {
                // Run Django tests.
                sh '. ${VENV}/bin/activate && python manage.py test'
            }
        }
        
        stage('SonarQube Analysis') {
            agent {
                docker {
                    image 'sonarsource/sonar-scanner-cli:latest'
                    reuseNode true
                }
            }
            steps {
                withSonarQubeEnv('SonarQube') {
                    sh '''
                    sonar-scanner \
                      -Dsonar.projectKey=${SONAR_PROJECT_KEY} \
                      -Dsonar.sources=. \
                      -Dsonar.host.url=http://sonar:9000 \
                      -Dsonar.python.coverage.reportPaths=coverage.xml \
                      -Dsonar.exclusions=frontend/**
                    '''
                }
            }
        }
        
        stage('Build Docker Image') {
            steps {
                script {
                    // Build the Docker image for the Django app
                    sh "docker build -t ${HARBOR_REGISTRY}/${HARBOR_PROJECT}/${IMAGE_NAME}:${IMAGE_TAG} ."
                }
            }
        }
        
        stage('Vulnerability Scan with Grype') {
            steps {
                // Use Grype to scan the container image for vulnerabilities
                sh "docker run --rm -v /var/run/docker.sock:/var/run/docker.sock anchore/grype ${HARBOR_REGISTRY}/${HARBOR_PROJECT}/${IMAGE_NAME}:${IMAGE_TAG} --fail-on high"
            }
        }
        
        stage('Push to Harbor Registry') {
            steps {
                script {
                    // Login to Harbor registry and push the image
                    withCredentials([usernamePassword(credentialsId: 'harbor-credentials', passwordVariable: 'HARBOR_PASSWORD', usernameVariable: 'HARBOR_USERNAME')]) {
                        sh "echo ${HARBOR_PASSWORD} | docker login ${HARBOR_REGISTRY} -u ${HARBOR_USERNAME} --password-stdin"
                        sh "docker push ${HARBOR_REGISTRY}/${HARBOR_PROJECT}/${IMAGE_NAME}:${IMAGE_TAG}"
                    }
                }
            }
        }
    }
    
    post {
        always {
            // Clean up Docker resources
            sh "docker rmi ${HARBOR_REGISTRY}/${HARBOR_PROJECT}/${IMAGE_NAME}:${IMAGE_TAG} || true"
            // Clean up workspace if needed
            cleanWs()
        }
        success {
            echo 'Build successful! Image built, tested, scanned, and pushed to Harbor registry.'
        }
        failure {
            echo 'Build failed. Please check the logs for details.'
        }
    }
}