# Abi Management - Frontend

This is the frontend of the application developed with Next.js and TailwindCSS.
Authentication is handled via Next.js and the custom backend.

## Environment variables

| **Variable**         | **Description**                                                                                         | **Accepted Values** | **Example**                                    |
|----------------------|---------------------------------------------------------------------------------------------------------|---------------------|------------------------------------------------|
| `NEXTAUTH_URL`       | The base url the server is running on.                                                                  | String              | `http://localhost:3000`                        |
| `NEXTAUTH_SECRET`    | The JWT-secret used by NextAuth to sign JWT keys. E.g., can be generated with `openssl rand -base64 32` | String              | `LkFby8v35raVplZDbetrAev0u13+KBEm6zhuCmYbvNA=` |
| `BACKEND_URL`        | The url to the backend used for API calls.                                                              | String              | `http://localhost:5000`                        |
| `SENTRY_DSN`         | The dsn used for Sentry.                                                                                | String              | `https://...ingest.sentry.io/...`              |
| `SENTRY_AUTH_TOKEN`  | The auth token used to authenticate with Sentry.                                                        | String              | `sntrys_...`                                   |
| `SENTRY_ENVIRONMENT` | The environment Sentry events should be associated with.                                                | String              | `production`                                   |

The listed environment variables are the bare minimum required to connect
the application to Sentry. More configurations, however, can be done with
[other environment variables](https://docs.sentry.io/platforms/node/guides/connect/configuration/options/).

## Build & Deploy

### Docker

#### Via Script

One should use the deployment script `deploy.bat` to build and deploy this application.

#### Manually

##### Build

You can build the application via the following command:

`docker build -t qetz/abi-management-frontend:VERSION .`

##### Deploy

You can deploy the application by first labelling and then pushing it:

````
docker image tag qetz/abi-management-frontend:VERSION qetz/abi-management-frontend:latest
````

`docker push qetz/abi-management-frontend:VERSION && docker push qetz/abi-management-frontend:latest`