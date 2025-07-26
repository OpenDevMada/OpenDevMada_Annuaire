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
        
        // Kubernetes config path - should be configured in Jenkins
        KUBECONFIG = '${JENKINS_HOME}/.kube/config'
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
                    // Build Docker image
                    docker.withRegistry('https://' + DOCKER_REGISTRY, 'docker-credentials') {
                        def customImage = docker.build("${DOCKER_IMAGE}:${DOCKER_TAG}", "-f Dockerfile .")
                        
                        // Push to registry if not on a feature branch
                        if (env.BRANCH_NAME == 'main' || env.BRANCH_NAME == 'master') {
                            customImage.push()
                            customImage.push('latest')
                        }
                    }
                }
            }
        }
        
        stage('Deploy to Kubernetes') {
            steps {
                script {
                    // Create namespace if it doesn't exist
                    sh "kubectl create namespace ${KUBE_NAMESPACE} --dry-run=client -o yaml | kubectl apply -f -"
                    
                    // Update image tag in deployment
                    sh "sed -i 's|image: ${DOCKER_IMAGE}:.*|image: ${DOCKER_IMAGE}:${DOCKER_TAG}|g' k8s/deployment.yaml"
                    
                    // Apply Kubernetes manifests
                    sh "kubectl apply -f k8s/ -n ${KUBE_NAMESPACE}"
                    
                    // Wait for rollout to complete
                    sh "kubectl rollout status deployment/opendev-frontend -n ${KUBE_NAMESPACE} --timeout=300s"
                }
            }
        }
        
        stage('Verify Deployment') {
            steps {
                script {
                    // Verify pods are running
                    sh "kubectl get pods -n ${KUBE_NAMESPACE}"
                    
                    // Get service URL
                    def serviceUrl = sh(script: "kubectl get svc opendev-frontend-service -n ${KUBE_NAMESPACE} -o jsonpath='{.spec.ports[0].nodePort}'", returnStdout: true).trim()
                    echo "Application deployed successfully! Access it at: http://your-k8s-node:${serviceUrl}"
                }
            }
        }
    }
    
    post {
        always {
            // Clean up workspace after build
            cleanWs()
            
            // Clean up Docker images to save space
            sh 'docker system prune -f --filter "until=24h"'
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
