pipeline {
    agent any

    environment {
        VENV = 'venv'
        IMAGE_NAME = 'banking-app'
        HARBOR_REGISTRY = 'localhost:8085'
        // HARBOR_REGISTRY = 'harbor-registry:8085'
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
        
        // stage('SonarQube Analysis') {
        //     steps {
        //         withSonarQubeEnv('SonarQube') {
        //             sh '''
        //             sonar-scanner \
        //               -Dsonar.projectKey=${SONAR_PROJECT_KEY} \
        //               -Dsonar.sources=. \
        //               -Dsonar.host.url=http://sonar:9000 \
        //               -Dsonar.python.coverage.reportPaths=coverage.xml \
        //               -Dsonar.exclusions=frontend/**
        //             '''
        //         }
        //     }
        // }
        
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
                script {
                    // Run scan without failing on any severity level
                    sh "docker run --rm -v /var/run/docker.sock:/var/run/docker.sock anchore/grype ${HARBOR_REGISTRY}/${HARBOR_PROJECT}/${IMAGE_NAME}:${IMAGE_TAG}"
                    
                    // Optional: Add a warning message about vulnerabilities
                    echo "Note: Vulnerability scan completed. Check the logs for any security findings."
                }
            }
        }
        
        // stage('Push to Harbor Registry') {
        //     steps {
        //         script {
        //             // Test Harbor connectivity first
        //             sh "curl -k -f --connect-timeout 10 http://${HARBOR_REGISTRY}/v2/ || echo 'Harbor registry not reachable'"
                    
        //             // Retry block with exponential backoff
        //             retry(1) {
        //                 sleep(time: 10, unit: 'SECONDS') // Add delay between retries
        //                 timeout(time: 1, unit: 'MINUTES') {
        //                     withCredentials([usernamePassword(credentialsId: 'harbor-credentials', 
        //                                                    passwordVariable: 'HARBOR_PASSWORD', 
        //                                                    usernameVariable: 'HARBOR_USERNAME')]) {
        //                         sh '''#!/bin/bash
        //                             set -e
        //                             set +x
        //                             DOCKER_TIMEOUT=120
        //                             export DOCKER_CLIENT_TIMEOUT=$DOCKER_TIMEOUT
        //                             export COMPOSE_HTTP_TIMEOUT=$DOCKER_TIMEOUT
        //                             echo "Attempting to log in to registry..."
        //                             echo $HARBOR_PASSWORD | docker login $HARBOR_REGISTRY -u $HARBOR_USERNAME --password-stdin
        //                         '''
                                
        //                         sh '''#!/bin/bash
        //                             set -e
        //                             echo "Pushing image to registry..."
        //                             docker push $HARBOR_REGISTRY/$HARBOR_PROJECT/$IMAGE_NAME:$IMAGE_TAG
        //                         '''
        //                     }
        //                 }
        //             }
        //         }
        //     }
        // }
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