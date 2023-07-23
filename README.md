# CCAPDEV-PHASE1-GROUP1-NEW
This README file will explain how to setup and run this application locally.

## Prerequisites
Ensure that the following are installed on your system:
* Node.js
* npm
* Mongoose
* MongoDB

## Getting Started
1. Clone the repository / Download the file locally
   - Use `git clone https://github.com/hcris2/CCAPDEV-PHASE1-GROUP1-NEW` or download as a ZIP file.

2. Navigate to the directory of app.js in your terminal

3. Install the packages needed
   - Run `npm install` on your terminal 

4. Start the server
   - Run `node app.js`
   - Your terminal shall say the following:
   ```
      Hello Listening at http://localhost:3000
      Connected to DB
   ```
   
5. Visit the website
   - Enter http://localhost:3000/ to visit the website.

## Using the website
You can register a username and password to log-in and access the Plan and Task pages.

Alternatively, you can import the users from the USERS_HASHED.json file directly into the database using Mongoose to log-in with the following 5 combinations:
| Username | Password |
| --- | --- |
| judilee | testPassword1 |
| jerome | testPassword2 |
| marc | testPassword3 |
| username4 | testPassword4 |
| username5 | testPassword5 |

  
You can also import **NOTIFS.json** and **TASKS.json** to get an idea of how notifications and tasks look in the website.
