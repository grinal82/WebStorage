# Grin-storage

![welcome](/assets/welcome_page.png)

## Basic Interface

### Registration form

![Registration](/assets/register_form_verification.png)

The resitration form is set up to validate the email pattern, password (sould be at least 6 characters and include 1 digit, 1 capital letter and a special symbol), username which should be at least 4 characters long

### Login form 

![Login](/assets/login_form_badpassword.png)

The login form notifies if the email or password are wrong

### User's storage

![UserStorage](/assets/userStorageWithFunctions.png)

User can upload files, change their names, generate a link to the file which he can share online for the other person to download. He can directly download the file by clicking on the appropriate button.

The table with files displays the size of the file, its upload date and last download date. When someone downloads the file the 'last_download_date' field is updated.

### ADMIN capabilities

![Admin-Dashboard](/assets/AdminDashboard.png)

Admins can benifit from the same capabilities as other users, plus as admins they can see all users of the application, see the number of files each user uploaded, the size of their files.

Admin can also appoint admin fuctions to other users by clicking on the checkbox.

Admins can inspect each user's storage, rename their files, share and download them 

![Admin-inspect-other-users](/assets/AdminInspectOtherUsers.png)

## Available Scripts

In the frontend directory, you can run:

### `npm run build`

The build folder will be compiled and copied to backend section so that DJANGO can use the static from that folder to generate templates.