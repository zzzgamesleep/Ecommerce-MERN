# Ecommerce MERN Project

This is a full-stack e-commerce application built using the MERN stack (MongoDB, Express.js, React.js, Node.js).

## Project Overview

The application provides standard e-commerce functionalities, allowing users to browse products, add items to a cart, and complete purchases. It features a separate backend API and a frontend user interface.

## Architecture

The project follows a common MERN stack architecture:

-   **Backend (`/Backend`):** A Node.js/Express.js server that handles business logic, API requests, database interactions (MongoDB via Mongoose), user authentication (JWT), and payment processing (Stripe).
-   **Frontend (`/Frontend`):** A single-page application built with React (using Vite for the build tooling) that consumes the backend API to display products, manage the user cart, and interact with the user.

## Key Technologies

**Backend:**

*   **Runtime:** Node.js
*   **Framework:** Express.js
*   **Database:** MongoDB (with Mongoose ODM)
*   **Authentication:** JSON Web Tokens (JWT), bcryptjs (for password hashing)
*   **Payments:** Stripe
*   **Image Storage:** Cloudinary
*   **Other:** `cookie-parser`, `dotenv`, `nodemon` (for development)

**Frontend:**

*   **Library:** React
*   **Build Tool:** Vite
*   **Styling:** Tailwind CSS
*   **HTTP Client:** Axios
*   **Linting:** ESLint

## Setup and Installation

Follow these steps to set up and run the project locally:

1.  **Clone the Repository:**
    ```bash
    git clone https://github.com/zzzgamesleep/Ecommerce-MERN.git
    cd Ecommerce-MERN
    ```

2.  **Backend Setup:**
    *   Navigate to the Backend directory:
        ```bash
        cd Backend
        ```
    *   Install dependencies:
        ```bash
        npm install
        ```
    *   Create a `.env` file in the `/Backend` directory. You will need to add the following environment variables (replace placeholders with your actual keys/URIs):
        ```dotenv
        MONGO_URI=your_mongodb_connection_string
        PORT=your_backend_port # e.g., 4000
        JWT_SECRET=your_jwt_secret_key
        JWT_EXPIRES=expiry_time # e.g., 7d
        COOKIE_EXPIRE=expiry_days # e.g., 7
        STRIPE_API_KEY=your_stripe_api_key
        STRIPE_SECRET_KEY=your_stripe_secret_key
        CLOUDINARY_URL=your_cloudinary_url
        # Add any other required variables
        ```
    *   Run the backend server:
        ```bash
        npm run dev   # For development (uses nodemon)
        # OR
        npm start # For production
        ```

3.  **Frontend Setup:**
    *   Navigate to the Frontend directory (from the root project folder):
        ```bash
        cd ../Frontend
        # or if you are still in Backend: cd ../../Frontend
        ```
    *   Install dependencies:
        ```bash
        npm install
        ```
    *   Run the frontend development server:
        ```bash
        npm run dev
        ```

4.  **Access the Application:**
    *   The frontend will typically be available at `http://localhost:5173` (or another port specified by Vite).
    *   The backend API will be running on the port specified in your `.env` file (e.g., `http://localhost:4000`). Ensure the frontend is configured to make requests to the correct backend URL (this might involve setting a proxy in `vite.config.js` or configuring Axios base URL).

## Usage

Once both the backend and frontend servers are running, you can access the application through your web browser at the frontend URL. You should be able to browse products, register/login, add items to the cart, and simulate the checkout process.
