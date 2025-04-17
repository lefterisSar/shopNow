# HTTPS Configuration for Production Environments

This document explains how HTTPS is configured for production environments in the ShopNow application.

## Backend Configuration

### Spring Boot Configuration

HTTPS is enabled in the production environment through Spring profiles. The configuration is defined in `src/main/resources/application.yml`:

```yaml
# Production configuration
spring:
  config:
    activate:
      on-profile: prod
  # ... other production settings ...
server:
  port: 443
  ssl:
    enabled: true
    key-store: classpath:keystore/shopnow.p12
    key-store-password: ${SSL_KEYSTORE_PASSWORD}
    key-store-type: PKCS12
    key-alias: shopnow
```

### SSL Certificate

The SSL certificate should be placed in `src/main/resources/keystore/shopnow.p12`. This file is excluded from version control for security reasons. See the README.md file in the keystore directory for instructions on how to generate and add a proper SSL certificate.

### Environment Variables

The following environment variables must be set in the production environment:

- `SSL_KEYSTORE_PASSWORD`: The password for the keystore
- `PROD_DB_USERNAME`: Production database username
- `PROD_DB_PASSWORD`: Production database password

### Running in Production Mode

To run the application in production mode with HTTPS enabled:

```bash
java -jar app.jar --spring.profiles.active=prod
```

## Frontend Configuration

### API Requests

The frontend code is configured to automatically use HTTPS in production environments. This is implemented in `frontend/src/api/axios.js`:

```javascript
// Determine if we're in production environment
const isProduction = window.location.hostname !== 'localhost' && 
                     window.location.hostname !== '127.0.0.1';

// Use HTTPS for production, HTTP for development
const protocol = isProduction ? 'https' : 'http';

// Use domain name in production, localhost in development
const host = isProduction ? 'api.shopnow.com' : 'localhost';

// Use standard HTTPS port (443) in production, specific ports in development
const port = isProduction ? '' : ':8081';

const instance = axios.create({
    baseURL: `${protocol}://${host}${port}`, // Environment-aware base URL
});
```

All API requests in the application use this axios instance, which automatically uses the appropriate protocol (HTTP or HTTPS) based on the environment.

### Deployment Considerations

When deploying the frontend to production:

1. Build the React application for production:
   ```bash
   npm run build
   ```

2. Deploy the built files to a web server that supports HTTPS.

3. Configure the web server to use a valid SSL certificate.

4. Ensure that the domain name used in the axios configuration (`api.shopnow.com` in this example) is correctly set to your actual API domain.

## Security Best Practices

1. Always use strong, unique passwords for the keystore.
2. Regularly rotate SSL certificates and ensure they are from trusted Certificate Authorities.
3. Keep the SSL private key secure and never commit it to version control.
4. Configure security headers in the application to enhance security:
   - Strict-Transport-Security (HSTS)
   - Content-Security-Policy
   - X-Content-Type-Options
   - X-Frame-Options
   - X-XSS-Protection

5. Regularly scan for vulnerabilities in both the frontend and backend code.