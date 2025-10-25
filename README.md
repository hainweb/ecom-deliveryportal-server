# Delivery Backend | Multi-Role E-Commerce Platform

Handles all **delivery-related APIs** — including delivery authentication, assigned orders, status updates, and cash collection.

---

## Features

- **Authentication**
  - Delivery personnel login
  - Logout (newly added)
  - Forgot password & OTP verification
  - Reset password
- **Order Management**
  - Fetch assigned orders from the central database
  - Filter orders by status, date, or other criteria (newly added)
  - Update order status:
    - `Shipped`
    - `Delivered`
  - Update cash collection status
- **Notifications**
  - Notify users and admins upon status updates
- **Analytics**
  - Integration with Super Admin analytics for delivery tracking

---

## Tech Stack

- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT Authentication

---

## Environment Variables

Create a `.env` file in the **root directory** of the project with the following variables:

```env
# MongoDB connection string
MONGO_URI=<your_mongodb_uri>

# Frontend URL for email links or redirects
FRONTEND_URL=http://localhost:3002

# Email credentials for sending OTPs and notifications
EMAIL_USER=<your_email_address>
EMAIL_PASS=<your_email_password>

# Secret key for JWT authentication
JWT_SECRET=<your_jwt_secret>

```
---

## Setup Instructions

```bash
# Clone the repository
git clone https://github.com/hainweb/ecom-deliveryportal-server.git

# Navigate to project directory
cd ecom-deliveryportal-server

# Install dependencies
npm install

# Start the development server
npm start