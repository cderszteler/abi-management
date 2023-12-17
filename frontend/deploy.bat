@echo off
set /p version=Enter new version:
docker build -t qetz/abi-management-frontend:%version% .
docker image tag qetz/abi-management-frontend:%version% qetz/abi-management-frontend:latest
docker push qetz/abi-management-frontend:%version% && docker push qetz/abi-management-frontend:latest