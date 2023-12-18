@echo off
set /p version=Enter new version:
docker build -t qetz/abi-management-backend:%version% .
docker image tag qetz/abi-management-backend:%version% qetz/abi-management-backend:latest
docker push qetz/abi-management-backend:%version% && docker push qetz/abi-management-backend:latest