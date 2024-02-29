# Virtual Room of Requirements - React/DjangoRF Authentication App

Welcome to the Virtual Room of Requirements! This is an authentication app built using React for the frontend, DjangoRF for the backend, and Postgres DB for the databases. The primary goal is to gradually improve code readability through patching.

## Requirements

- Python
- Node.js
- PostgreSQL

## Installation

1. Create a Virtual Environment

    python -m venv env

2. Activate the Virtual Environment

    For Windows:
    env\scripts\activate

    For Unix/MacOS:
    source env/bin/activate

3. Install Python Dependencies

    pip install -r requirements.txt

4. Install Node.js Dependencies

    Navigate to the frontend directory and run:

    npm install

## Usage

1. Run the DjangoRF Server

    python manage.py runserver

    The Django server will start running at http://localhost:8000/.

2. Run the React Development Server

    Navigate to the frontend directory and run:

    npm run dev

    The React development server will start running at http://localhost:5173/.

3. Access the Application

    Open your web browser and navigate to http://localhost:5173/ to access the application.


## License

This project is licensed under the MIT License.
