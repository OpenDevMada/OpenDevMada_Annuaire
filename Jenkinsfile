pipeline {
    agent any
    
    environment {
        // Define any environment variables here
        NODE_VERSION = '18.x'
        WORKSPACE = "${WORKSPACE}"
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
        
        stage('Deploy') {
            steps {
                // Add deployment steps here
                // Example: Deploy to a web server or S3 bucket
                echo 'Deployment steps would go here'
                // Example:
                // bat 'aws s3 sync front/ s3://your-s3-bucket/ --delete'
            }
        }
    }
    
    post {
        always {
            // Clean up workspace after build
            cleanWs()
        }
        success {
            echo 'Pipeline completed successfully!'
        }
        failure {
            echo 'Pipeline failed!'
            // Add notification (e.g., email, Slack)
        }
    }
}
