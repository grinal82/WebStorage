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

### be sure to install 'npm' and 'node' then proceed as follows

```bash
cd ../frontend/

npm install

npm run build

cd ../backend/

python manage.py runserver

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

### Basic installations needed for backend DEPLOYMENT

```bash
sudo apt update && sudo apt upgrade
sudo apt install python3-pip python3-dev libpq-dev postgresql postgresql-contrib nginx curl python3-venv
```

### Installin node.js and npm to be able to compile the build folder in the frontend section

1.Download and import the Nodesource GPG key

```bash
cd ~
sudo apt-get update
sudo apt-get install -y ca-certificates curl gnupg
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | sudo gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg
```

2.Create deb repository

```bash
NODE_MAJOR=20
echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_$NODE_MAJOR.x nodistro main" | sudo tee /etc/apt/sources.list.d/nodesource.list
```

3.Create deb repository

```bash
sudo apt-get update
sudo apt-get install nodejs -y
```

### Setting up the DATABASE

```bash
sudo -u postgres psql

CREATE DATABASE webstorage;

CREATE USER ${username} WITH PASSWORD 'password';

ALTER ROLE ${username} SET client_encoding TO 'utf8';
ALTER ROLE ${username} SET default_transaction_isolation TO 'read committed';
ALTER ROLE ${username} SET timezone TO 'UTC';

GRANT ALL PRIVILEGES ON DATABASE webstorage TO ${username};

\q
```

### Project DEPLOYMENT

#### upgrade pip manager

```bash
sudo -H pip3 install --upgrade pip

```

#### Cloning the repo with Project

```bash
git clone https://github.com/grinal82/WebStorage.git
```

#### Installing frontend requirement and compiling the project to 'build' folder

> NOTE: The "build" folder will be automaticlly copied to 'backend'(django) folder so that Django could use the static files and form templates

```bash
cd ~/WebStorage/frontend/

npm install package.json

npm run build
```

```bash
cd ~/WebStorage/backend
```

#### Setting up the virtual environment, activating it and downloading the requirements for the project

```bash
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

#### Setting up environment variables

```bash
nano .env
```

> creating '.env' file to store environment variables such as the credentials for Database you set up ealier and a 'SECRET_KEY' which can be generated ![here](https://djecrety.ir/)

```
DB_NAME = ""

DB_USER = ""

DB_PASSWORD = ""

SECRET_KEY = ""
```

#### install gunicorn WSGI

```bash
pip install gunicorn
```

#### Changin setting to production ones

```bash
nano config/production.py
```

> check if DEBUG variable is set to 'FALSE', write down your IP and/or domain in the 'ALLOWED_HOSTS'
> check if other variables and parameters correspond

```
DEBUG = False

ALLOWED_HOSTS = ["YOUR_IP","YOUR DOMAIN"]

WSGI_APPLICATION= "webstorage.wsgi.application"

CORS_ALLOWED_ORIGINS=[
"http://localhost",
"http://localhost:8000",
"http://{YOUR_IP}",
"http://{YOUR_IP}:8000",
]

SECURE_CROSS_ORIGIN_OPENER_POLICY=None

SECRET_KEY=os.getenv("SECRET_KEY")

# basic static folder of the project
STATIC_URL = "static/"
# for collection of additional static files into static folder of the project
STATICFILES_DIRS = [os.path.join(BASE_DIR, "build/static")]
# MAIN STATIC FILE to be served BY NGINX!
STATIC_ROOT = "/var/www/html/static"

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": os.getenv("DB_NAME"),
        "USER": os.getenv("DB_USER"),
        "PASSWORD": os.getenv("DB_PASSWORD"),
        "HOST": "localhost",
    }
}
```

```bash
sudo nano manage.py
```

>Change

```python
"os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.base")" 
```

>to be

```python
"os.environ.setdefault("DJANGO_SETTINGS_MODULE", *"config.production"*)" 
```

#### Make and apply makemigrations

```bash
python3 manage.py makemigrations

python3 manage.py migrate
```

#### Create superuser and collecting static files both for testing using only WSGI and for using NGING

The static files will be collected to the static folder of the project (config.base) so that you could test the WSGI \
and to the ```/var/www/html/static``` so that NGINX could serve them after its configured later on

```bash
python manage.py createsuperuser
python manage.py collectstatic --settings=config.base
python manage.py collectstatic --settings=config.production
```

#### in production config the static is collected to ```/var/www/html/static``` to be served by NGINX

> you can check the initial deployment of the project by starting it manually

```bash
(venv)~/WebStorage/backend/manage.py runserver 0.0.0.0:8000
```

*Open your browser at http://server_domain_or_IP:8000*

### GUNICORN - WSGI SETTINGS

#### Checking if the gunicorn works if launched explicitly from the console

```bash
gunicorn --bind 0.0.0.0:8000 webstorage.wsgi
```

then you can open the browser type in your 'ip/domain:8001' and you should get the index page of the application

#### Setting up the GUNICOR wich is WSGI (Web Server Gateway Interface) to work as a daemon/service (automatically)

##### Dont forget to quit from virtual environment by ```deactivate```

```bash
sudo nano /etc/systemd/system/gunicorn.socket
```

```
[Unit]
Description=gunicorn socket


[Socket]
ListenStream=/run/gunicorn.sock

[Install]

WantedBy=sockets.target
```

```bash
sudo nano /etc/systemd/system/gunicorn.service
```

```
[Unit]
Description=gunicorn daemon
Requires=gunicorn.socket
After=network.target

[Service]
User=grin
Group=www-data
WorkingDirectory=/home/{user}/WebStorage/backend
Environment="DJANGO_SETTINGS_MODULE=config.production"
ExecStart=/home/{user}/WebStorage/backend/venv/bin/gunicorn \
--access-logfile - \
--workers=3 \
--bind unix:/run/gunicorn.sock \
webstorage.wsgi:application

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl daemon-reload
```

```bash
sudo systemctl start gunicorn.socket
```

```bash
sudo systemctl enable gunicorn.socket
```

#### checking the status of the gunicorn service

```bash
sudo systemctl status gunicorn.socket
```

```bash
sudo systemctl status gunicorn
```

-The output of the command should be *'Active: active (running); Listen: /run/gunicorn.sock (Stream)'*

#### Lest check that gunicorn.cocket file is indeed created in '/run' directory

```bash
file run/gunicorn.sock
```

-Output: '/run/gunicorn.sock: socket'

#### Checking the journal

```bash
sudo journalctl -u gunicorn.socket
```

-Output: 'Listening on gunicorn socket.'

#### Additional check by curl requirements

```bash
curl --unix-socket /run/gunicorn.sock localhost
```

This command should display an html page in you console meaning that gunicorn
is working properly. /run/gunicorn.sock: socket

### Setting up NGINX server

```bash
sudo nano /etc/nginx/sites-available/webstorage
```

```
server {
   listen 80;
   server_name <DOMAIN OR IP_ADDRESS>;

   location = /favicon.ico { access_log off; log_not_found off;}

   location /static/ {
      root /var/www/html/;
   }
   location / {
      include proxy_params;
      proxy_pass http://unix:/run/gunicorn.sock;
      proxy_http_version 1.1;
      proxy_set_header Upgrade $http_upgrade;
      proxy_set_header Connection 'upgrade';
      proxy_cache_bypass $http_upgrade;
      client_max_body_size 40M;
      proxy_read_timeout 300s;
   }
   location /media/ {
      root /home/grin/WebStorage/backend;
   }
   error_page 500 502 503 504 /50x.html;
   location = /50x.html {
      root /usr/share/nginx/html;
   }
}
```

#### Creating a link for config file to enable them

```bash
sudo ln -s /etc/nginx/sites-available/webstorage  /etc/nginx/sites-enabled
```

#### Attributing the rights to the folder from which NGINX will serve the static files

change directory to the one NGINX will use to serve static

```bash
cd /var/www/html
```

Attribute the neccessary rights (so that the files can be read from that directory)
> {your_username} means the user of the Operating system you created on the first step in order not to configure everything as 'root' user

```bash
sudo chown {your_username}:{your_username} .
```

#### Set the rule for firewall to allow nginx

```bash
sudo ufw allow 'Nginx Full'
```

#### Changing the BASIC_URL const to your IP_ADDRESS

```bash
sudo nano ~/Webstorage/frontend/src/settings/basic.js
```

>inside the basic.js be sure to modify 'const BASIC_URL'

```javascript
export const BASIC_URL = "http://{YOUR IP_ADDRESS}";
```

#### Recompile the 'build' folder with new BASIC_URL, so that you frontend can address the right endpoint

```bash
cd ~/Webstorage/frontend/ && npm run build
```

#### Re-collect static files to the ```/var/www/html/static``` to be served by NGINX

```bash
cd ~/Webstorage/backend/ && source venv/bin/activate 
```

```bash
python manage.py collectstatic --settings=config.production
```

#### restarting nginx

```bash
sudo systemctl restart nginx
```

#### checking the operational status of the nginx

```bash
sudo systemctl status nginx
```
