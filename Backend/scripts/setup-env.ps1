param(
    [Parameter(Mandatory=$true)]
    [string]$FaceApiKey,
    
    [Parameter(Mandatory=$true)]
    [string]$FaceApiEndpoint
)

# Create or update .env file
$envContent = @"
AZURE_FACE_KEY=$FaceApiKey
AZURE_FACE_ENDPOINT=$FaceApiEndpoint
"@

Set-Content -Path "..\\.env" -Value $envContent

Write-Host "Environment variables have been set successfully!"
Write-Host "To start the backend server, run:"
Write-Host "cd Backend"
Write-Host "npm start"