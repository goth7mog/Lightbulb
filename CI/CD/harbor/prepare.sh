#!/bin/bash

# Simple script to verify all required files exist
echo "Verifying Harbor configuration files..."

required_files=(
  "config/core/app.conf"
  "secret/core/key"
  "config/registry/config.yml"
  "config/jobservice/config.yml"
  "config/nginx/nginx.conf"
)

all_exists=true

for file in "${required_files[@]}"; do
  if [ ! -f "$file" ]; then
    echo "ERROR: Missing file $file"
    all_exists=false
  else
    echo "✓ $file exists"
  fi
done

if [ "$all_exists" = true ]; then
  echo "All required files exist. Harbor should be ready to start."
  echo "Run 'cd .. && docker-compose up -d' to start Harbor."
else
  echo "Some files are missing. Please fix the errors before starting Harbor."
  exit 1
fi
