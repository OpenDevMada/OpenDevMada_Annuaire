pipeline {
    agent any
    
    environment {
        // Environment variables
        NODE_VERSION = '18.x'
        DOCKER_IMAGE = 'opendev-frontend'
        DOCKER_TAG = "${env.BUILD_NUMBER}"
        KUBE_NAMESPACE = 'opendev'
        
        // Get from Jenkins credentials
        DOCKER_REGISTRY = 'your-docker-registry'  // e.g., 'docker.io/yourusername'
        
        // Platform-specific settings
        IS_WINDOWS = isUnix() ? 'false' : 'true'
        SHELL = 'powershell -NoProfile -ExecutionPolicy Bypass -Command'
        
        // Kubernetes config path - should be configured in Jenkins
        KUBECONFIG = isUnix() ? 
            '${JENKINS_HOME}/.kube/config' : 
            '%USERPROFILE%\\.kube\\config'
    }
    
    stages {
        stage('Checkout') {
            steps {
                // Checkout the code from version control
                checkout scm
            }
        }
        
        stage('Setup Node.js') {
            steps {
                // Setup Node.js environment
                nodejs(nodeJSInstallationName: 'NodeJS') {
                    // Verify Node.js and npm versions
                    bat 'node --version'
                    bat 'npm --version'
                }
            }
        }
        
        stage('Install Dependencies') {
            steps {
                dir('front') {
                    // Install project dependencies if you have a package.json
                    script {
                        if (fileExists('package.json')) {
                            bat 'npm install'
                        }
                    }
                }
            }
        }
        
        stage('Lint') {
            steps {
                dir('front') {
                    // Add linting if you have ESLint or similar
                    script {
                        if (fileExists('node_modules/.bin/eslint')) {
                            bat 'npx eslint assets/js/'
                        }
                    }
                }
            }
        }
        
        stage('Test') {
            steps {
                dir('front') {
                    // Add testing if you have tests
                    script {
                        if (fileExists('package.json') && 
                            fileExists('node_modules/.bin/jest')) {
                            bat 'npm test'
                        }
                    }
                }
            }
        }
        
        stage('Build') {
            steps {
                dir('front') {
                    // Add build steps if you have any (e.g., webpack, gulp)
                    script {
                        if (fileExists('package.json') && 
                            fileExists('node_modules/.bin/webpack')) {
                            bat 'npm run build'
                        }
                    }
                }
            }
        }
        
        stage('Build Docker Image') {
            steps {
                script {
                    // Ensure Docker is available
                    bat 'docker --version'
                    
                    // Build Docker image
                    def dockerBuildCmd = "docker build -t ${DOCKER_IMAGE}:${DOCKER_TAG} -f Dockerfile ."
                    
                    if (env.IS_WINDOWS == 'true') {
                        bat "${dockerBuildCmd}"
                    } else {
                        sh "${dockerBuildCmd}"
                    }
                    
                    // Push to registry if on main/master branch
                    if (env.BRANCH_NAME == 'main' || env.BRANCH_NAME == 'master') {
                        withCredentials([string(credentialsId: 'docker-credentials', variable: 'DOCKER_CREDS')]) {
                            if (env.IS_WINDOWS == 'true') {
                                bat "docker login -u $env.DOCKER_CREDS_USR -p $env.DOCKER_CREDS_PSW ${DOCKER_REGISTRY}"
                                bat "docker tag ${DOCKER_IMAGE}:${DOCKER_TAG} ${DOCKER_REGISTRY}/${DOCKER_IMAGE}:${DOCKER_TAG}"
                                bat "docker push ${DOCKER_REGISTRY}/${DOCKER_IMAGE}:${DOCKER_TAG}"
                                bat "docker tag ${DOCKER_IMAGE}:${DOCKER_TAG} ${DOCKER_REGISTRY}/${DOCKER_IMAGE}:latest"
                                bat "docker push ${DOCKER_REGISTRY}/${DOCKER_IMAGE}:latest"
                            } else {
                                sh "docker login -u $DOCKER_CREDS_USR -p $DOCKER_CREDS_PSW ${DOCKER_REGISTRY}"
                                sh "docker tag ${DOCKER_IMAGE}:${DOCKER_TAG} ${DOCKER_REGISTRY}/${DOCKER_IMAGE}:${DOCKER_TAG}"
                                sh "docker push ${DOCKER_REGISTRY}/${DOCKER_IMAGE}:${DOCKER_TAG}"
                                sh "docker tag ${DOCKER_IMAGE}:${DOCKER_TAG} ${DOCKER_REGISTRY}/${DOCKER_IMAGE}:latest"
                                sh "docker push ${DOCKER_REGISTRY}/${DOCKER_IMAGE}:latest"
                            }
                        }
                    }
                }
            }
        }
        
        stage('Deploy to Kubernetes') {
            steps {
                script {
                    // Create namespace if it doesn't exist
                    def nsCmd = "kubectl create namespace ${KUBE_NAMESPACE} --dry-run=client -o yaml | kubectl apply -f -"
                    
                    // Update image tag in deployment (platform-specific sed command)
                    if (env.IS_WINDOWS == 'true') {
                        // For Windows, we'll use PowerShell to update the file
                        def updateImageCmd = """
                            \$content = Get-Content k8s/deployment.yaml -Raw
                            \$content -replace 'image: ${DOCKER_IMAGE}:.*', 'image: ${DOCKER_IMAGE}:${DOCKER_TAG}' | 
                            Set-Content k8s/deployment.yaml -NoNewline
                        """
                        bat updateImageCmd
                        bat nsCmd
                    } else {
                        sh nsCmd
                        sh "sed -i 's|image: ${DOCKER_IMAGE}:.*|image: ${DOCKER_IMAGE}:${DOCKER_TAG}|g' k8s/deployment.yaml"
                    }
                    
                    // Apply Kubernetes manifests
                    def applyCmd = "kubectl apply -f k8s/ -n ${KUBE_NAMESPACE}"
                    if (env.IS_WINDOWS == 'true') {
                        bat applyCmd
                    } else {
                        sh applyCmd
                    }
                    
                    // Wait for rollout to complete
                    def rolloutCmd = "kubectl rollout status deployment/opendev-frontend -n ${KUBE_NAMESPACE} --timeout=300s"
                    if (env.IS_WINDOWS == 'true') {
                        bat rolloutCmd
                    } else {
                        sh rolloutCmd
                    }
                }
            }
        }
        
        stage('Verify Deployment') {
            steps {
                script {
                    // Verify pods are running
                    def getPodsCmd = "kubectl get pods -n ${KUBE_NAMESPACE}"
                    if (env.IS_WINDOWS == 'true') {
                        bat getPodsCmd
                    } else {
                        sh getPodsCmd
                    }
                    
                    // Get service URL
                    def getServiceUrlCmd = "kubectl get svc opendev-frontend-service -n ${KUBE_NAMESPACE} -o jsonpath='{.spec.ports[0].nodePort}'"
                    def serviceUrl = ''
                    
                    if (env.IS_WINDOWS == 'true') {
                        serviceUrl = bat(script: getServiceUrlCmd, returnStdout: true).trim()
                    } else {
                        serviceUrl = sh(script: getServiceUrlCmd, returnStdout: true).trim()
                    }
                    
                    echo "Application deployed successfully! Access it at: http://your-k8s-node:${serviceUrl}"
                    
                    // If running in Jenkins, set the build description with the URL
                    currentBuild.description = "Deployed: http://your-k8s-node:${serviceUrl}"
                }
            }
        }
    }
    
    post {
        always {
            // Clean up workspace after build
            cleanWs()
            
            // Clean up Docker images to save space (platform-specific)
            if (env.IS_WINDOWS == 'true') {
                bat 'docker system prune -f --filter "until=24h"'
            } else {
                sh 'docker system prune -f --filter "until=24h"'
            }
        }
        success {
            echo 'Pipeline completed successfully!'
            // Send success notification
            slackSend(color: 'good', message: "✅ Pipeline ${env.JOB_NAME} #${env.BUILD_NUMBER} succeeded!")
        }
        failure {
            echo 'Pipeline failed!'
            // Send failure notification
            slackSend(color: 'danger', message: "❌ Pipeline ${env.JOB_NAME} #${env.BUILD_NUMBER} failed! ${env.BUILD_URL}")
        }
        unstable {
            echo 'Pipeline is unstable!'
            slackSend(color: 'warning', message: "⚠️ Pipeline ${env.JOB_NAME} #${env.BUILD_NUMBER} is unstable! ${env.BUILD_URL}")
        }
    }
}
