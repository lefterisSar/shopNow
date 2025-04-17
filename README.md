# Shop Now - User Service

User Service for Shop Now e-commerce application.

## Environment Setup

This project uses environment variables for configuration. Follow these steps to set up your environment:

1. Copy the `.env.example` file to a new file named `.env` in both the project root and the resources directory:
   ```
   cp .env.example .env
   cp src/main/resources/.env.example src/main/resources/.env
   ```

2. Edit both `.env` files and replace the placeholder values with your actual configuration:
   - Database credentials
   - JWT secret key
   - SSL keystore password
   - Production database credentials

3. The application will automatically use these environment variables when it starts.

**Note:** The `.env` files contain sensitive information and are excluded from version control. Never commit your `.env` files to the repository.

## Development

The application uses Spring profiles for different environments:
- `dev` profile (default): Used for local development
- `prod` profile: Used for production deployment
