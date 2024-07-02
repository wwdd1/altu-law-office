#!/bin/bash

# Check if VERCEL_GIT_COMMIT_REF environment variable is set
if [ -z "$VERCEL_GIT_COMMIT_REF" ]; then
  echo "VERCEL_GIT_COMMIT_REF environment variable is not set."
  exit 0
fi

# Check if the current branch is 'dev'
if [ "$VERCEL_GIT_COMMIT_REF" = "dev" ]; then
  echo "This is a push to the 'dev' branch."
  exit 1
else
  echo "This is not a push to the 'dev' branch."
  exit 0
fi