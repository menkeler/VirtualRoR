# Virtual Room of Requirements - React/DjangoRF Authentication App

Welcome to the Virtual Room of Requirements, an authentication app built using React for the frontend and DjangoRF for the backend. The primary goal is to gradually improve code readability through patching. Please follow the instructions below to set up the project and run it on your local machine.

## Branch

Create a branch named `Virtual_Room_of_Requirements` for this project.

## Requirements

- [Python](https://www.python.org/)
- [Node.js](https://nodejs.org/)
- [PostgreSQL](https://www.postgresql.org/)

## Installation

### Backend

1. Create a virtual environment:

    ```bash
    python -m venv env
    ```

2. Activate the virtual environment:

    ```bash
    env\scripts\activate
    ```

3. Install backend dependencies:

    ```bash
    pip install django djangorestframework django-cors-headers pylance Pillow psycopg2 factory-boy
    ```

### Frontend

1. Install frontend dependencies:

    ```bash
    npm install -D tailwindcss postcss autoprefixer
    npx tailwindcss init -p
    npm i -D daisyui@latest
    npm install axios react-router-dom @react-oauth/google js-cookie jwt-decode react-select react-window react-select-virtualized react@latest react-virtualized@latest patch-package crypto-js babel-plugin-macros @fortawesome/fontawesome-free
    ```

## Database Configuration (Backend)

Customize the database settings in the `backend/settings.py` file. Make sure to install PostgreSQL and set it up according to your preferences.

## Usage

### Run Backend

1. Navigate to the backend directory:

    ```bash
    cd backend
    ```

2. Run the Django development server:

    ```bash
    python manage.py runserver
    ```

### Run Frontend

1. Navigate to the frontend directory:

    ```bash
    cd frontend
    ```

2. Start the React development server:

    ```bash
    npm start
    ```

## Future Updates

A `requirements.txt` file will be added in the future for easier dependency management. Feel free to contribute and gradually improve code readability through patching.
for now that is the list of modules i used in backend front end

## Installations
on file root first do
python -m venv env

then use that everytime you run

```
env\scripts\activate
```
* backend
```
pip install django 
pip install djangorestframework django-cors-headers
pip install pylance
pip install Pillow
pip install psycopg2
pip install factory-boy
```

* frontend
```
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
npm i -D daisyui@latest
npm install axios
npm install react-router-dom
npm install @react-oauth/google
npm i js-cookie
npm i jwt-decode
npm install react-select react-window
npm i react-select-virtualized
npm install react@latest react-virtualized@latest
npm i patch-package 
npm install crypto-js
npm install babel-plugin-macros
npm i @fortawesome/fontawesome-free
npm install --save @fortawesome/fontawesome-free
npm install --save @fortawesome/free-solid-svg-icons

```

```
