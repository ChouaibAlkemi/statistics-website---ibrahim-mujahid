# Child Aggression Assessment System

A full-stack web application designed to evaluate aggression levels in children through a structured psychological questionnaire.

## Features

- **50-Question Assessment**: Categorized into Physical, Verbal, Anger, School, and Home sections.
- **Automated Scoring**: Instant calculation of aggression levels (Low, Medium, High, Critical).
- **User Dashboard**: Save and view history of assessments.
- **Admin Dashboard**: Analytics and statistics on user data.
- **Responsive Design**: Mobile-friendly interface built with React and TailwindCSS.
- **Secure Authentication**: JWT-based login and registration.

## Technology Stack

- **Frontend**: React (Vite), TailwindCSS, Recharts, Lucide React
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose)

## Setup & Installation

### Prerequisites

- Node.js (v14+)
- MongoDB (running on default port 27017)

### Installation Steps

1.  **Clone the repository**:

    ```bash
    git clone <repository-url>
    cd child-aggression-assessment
    ```

2.  **Backend Setup**:

    ```bash
    cd server
    npm install
    # Create .env file if not exists
    echo "PORT=5000" > .env
    echo "MONGO_URI=mongodb://127.0.0.1:27017/child_aggression_db" >> .env
    echo "JWT_SECRET=your_jwt_secret" >> .env
    # Seed Database (Optional)
    node seed.js
    # Start Server
    npm start
    ```

3.  **Frontend Setup**:

    ```bash
    cd ../client
    npm install
    npm run dev
    ```

4.  **Access the App**:
    Open [http://localhost:5173](http://localhost:5173) in your browser.

## Default Admin Credentials (Seed Data)

- **Email**: admin@example.com
- **Password**: password123

## License

MIT
