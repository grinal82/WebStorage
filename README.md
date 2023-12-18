# Webstorage web-app

## Quick start (LOCAL INSTALLATION)

installation Steps if you want to try it out

> backend section

```bash
git clone https://github.com/grinal82/WebStorage.git

cd backend

python -m venv venv 

source venv/bin/activate

pip install -r requirements.txt

python manage.py makemigrations

python manage.py migrate

```

> frontend section

```bash
cd ../frontend/

npm install

npm run build

cd ../backend/

python manage.py runserver 8001

```

**Note:**
The frontend is compiled into the `build` folder, which is copied to the backend folder, allowing Django to use it for generating templates. As a result, the application runs on the same port, preventing issues like 'forbidden access' and other problems related to CORS.

## After installation of all requirements the struncture of the project should be like that

![structure](/assets/StructureOfProject.png)

## DEPLOYMENT ON A SERVER

```bash
ssh root@<your server IP address>



```
