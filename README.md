# Webstorage web-app

## Quick start

installation Steps if you want to try it out

> backend section

```bash
git clone https://github.com/grinal82/WebStorage.git

cd backend

python -m venv venv 

source venv/bin/activate

pip install -r requirements.txt

cd webstorage

python manage.py migrate

python manage.py runserver 8001


```

> frontend section

```bash
cd ../../frontend

npm install

npm run build

```

**Note:**
The frontend is compiled into the `build` folder, which is copied to the backend folder, allowing Django to use it for generating templates. As a result, the application runs on the same port, preventing issues like 'forbidden access' and other problems related to CORS.


## After installation of all requirements the struncture of the project should be like that

Webstorage/
  ├─backend/
  │ ├── build/
  │ ├── media/
  │ ├── static/
  │ ├── webstorage/
  │ ├── config/
  │ │   ├── __init__.py
  │ │   ├── base.py
  │ │   ├── development.py
  │ │   |── production.py
  │ ├── files_api/
  │ ├── user_api/
  │ ├── manage.py
  │ ├── requirements.txt
  │ └── README.md (for backend)
  │  
  ├─frontend/
  │  ├── build/
  │  ├── public/
  │  ├── src/
  │  │   ├── components/
  │  │   │    ├── Dashboard.jsx
  │  │   │    ├── FilesHandler.jsx
  │  │   │    └── Navbar.jsx
  │  │   ├── pages/
  │  │   │    ├── AdminInspectFiles.jsx
  │  │   │    ├── Login.jsx
  │  │   │    ├── Register.jsx
  │  │   │    ├── UserStorage.jsx
  │  │   │    └── WelcomePage.jsx
  │  │   ├── store/
  │  │   │    ├── adminReducer.js
  │  │   │    ├── authReducer.js
  │  │   │    ├── filesReducer.js
  │  │   │    └── index.js
  │  │   │── app.css
  │  │   ├── app.js
  │  │   ├── index.css
  │  │   ├── index.js
  │  │
  │  │
  │  ├── package.json
  │  ├── package-lock.json
  │  ├── README.md (for frontend)
  │
  │
  ├─ gitignore
  ├─ README.md (for the entire app)
  └── assets/
