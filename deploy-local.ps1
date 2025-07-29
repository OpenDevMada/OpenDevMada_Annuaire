# Build the Docker image
docker build -t opendev-frontend:latest .

# Load the image into the local Kubernetes nodes (for Docker Desktop with Kubernetes)
kubectl delete -f k8s/ 2> $null
kubectl apply -f k8s/

# Wait for the deployment to be ready
Write-Host "Waiting for deployment to be ready..."
kubectl wait --for=condition=available --timeout=300s deployment/opendev-frontend

# Get the service URL
$ingressIP = kubectl get ingress opendev-ingress -o jsonpath='{.status.loadBalancer.ingress[0].ip}'

if ([string]::IsNullOrEmpty($ingressIP)) {
    $nodePort = kubectl get svc opendev-frontend-service -o jsonpath='{.spec.ports[0].nodePort}'
    Write-Host "\nApplication deployed successfully!"
    Write-Host "Access the application at: http://localhost:$nodePort"
} else {
    Write-Host "\nApplication deployed successfully!"
    Write-Host "Access the application at: http://$ingressIP"
}

# Show pod status
Write-Host "\nPod status:"
kubectl get pods
