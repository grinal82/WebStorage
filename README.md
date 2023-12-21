# Webstorage web-app

![The app](/assets/AdminDashboard.png)

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

## be sure to install 'npm' and 'node' then proceed as follows

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

### Basic SERVER SETUP

```bash
ssh root@your_server_IP_address
```

```bash

adduser your_username
```

```bash

usermod your_username -aG sudo
```

```bash
su your_username

```

```bash
sudo apt update && sudo apt upgrade
```

```bash
sudo apt install python3-venv python3-pip postgresql nginx
```

```bash
sudo systemctl start nginx
```

```bash
git clone https://github.com/grinal82/WebStorage.git

cd WebStorage/backend
```

### Setting up the DATABASE

```bash
sudo su postgres

ALTER USER postgres WITH PASSWORD 'SOME_NEW_PASSWORD'

CREATE DATABASE <DB_NAME>

\q
```

```bash
nano .env
```

> creating '.env' file to store environment variables such as the credentials for Database you set up ealier and a 'SECRET_KEY' which can be generated ![here](https://djecrety.ir/)
Enter your DB name
>DB_NAME = ""
Enter your DB usrname
>DB_USER = ""
Enter you DB password
>DB_PASSWORD = ""
generate here:<https://djecrety.ir/>
>SECRET_KEY = ""

```bash
cd backend
```

```bash
python -m venv venv 
```

```bash
source venv/bin/activate
```

```bash
pip install -r requirements.txt
```

```bash
pip install gunicorn
```

```bash
nano config/production.py
```

> check if DEBUG variable is set to 'FALSE', write down your IP and/or domain in the 'ALLOWED_HOSTS'

```bash
nano manage.py
```

Change 'os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.base")' to be 'os.environ.setdefault("DJANGO_SETTINGS_MODULE", *"config.production"*)'

## Setting up the GUNICOR wich is WSGI (Web Server Gateway Interface)
