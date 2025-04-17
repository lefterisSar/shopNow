# SSL Certificate for Production

This directory is where the SSL certificate for HTTPS in the production environment should be placed.

## Certificate Requirements

- The certificate should be in PKCS12 format (.p12 file)
- The file should be named `shopnow.p12`
- The certificate should be issued by a trusted Certificate Authority for production use

## How to Generate a Self-Signed Certificate for Testing

For testing purposes, you can generate a self-signed certificate using the following command:

```bash
keytool -genkeypair -alias shopnow -keyalg RSA -keysize 2048 -storetype PKCS12 -keystore shopnow.p12 -validity 3650
```

When prompted, provide the following information:
- Password: (use a strong password and set it as SSL_KEYSTORE_PASSWORD environment variable)
- First and Last name: your domain name (e.g., example.com)
- Organizational unit: your team name
- Organization: your company name
- City: your city
- State: your state
- Country code: your two-letter country code

## Production Setup

In a production environment:

1. Obtain a proper SSL certificate from a trusted Certificate Authority
2. Convert it to PKCS12 format if necessary
3. Name it `shopnow.p12` and place it in this directory
4. Set the following environment variables:
   - `SSL_KEYSTORE_PASSWORD`: The password for the keystore
   - `PROD_DB_USERNAME`: Production database username
   - `PROD_DB_PASSWORD`: Production database password

5. Run the application with the production profile:
   ```bash
   java -jar app.jar --spring.profiles.active=prod
   ```

## Security Note

Never commit the actual certificate file to version control. Add it to .gitignore and manage it securely through your deployment process.