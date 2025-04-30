#!/bin/bash
clear
SERVICE_NAME="$1"
ENVIRONMENT="${ENVIRONMENT:-dev}"  # Default to dev if not set
PROJECT_ID="${PROJECT_ID}"  # Default project
# DOCKER_TAG="${DOCKER_TAG:-${ENVIRONMENT}-latest}"  # Default tag includes environment

# Check if jq command exists
if ! command -v jq &> /dev/null; then
    echo "Error: jq is not installed"
    exit 1
fi

echo "[$ENVIRONMENT] Attempting to deploy ./apps/$SERVICE_NAME to project $PROJECT_ID"

IMAGE_HASH=$(gcloud builds submit \
    --config ./cloudbuild.yaml \
    --substitutions=_IMAGE_NAME="$SERVICE_NAME" \
    --project="$PROJECT_ID" \
    --format='json(results.buildStepImages[0])' 
	# \
    # --suppress-logs --quiet | jq -r '.results.buildStepImages[0]'
    )

echo "$IMAGE_HASH"