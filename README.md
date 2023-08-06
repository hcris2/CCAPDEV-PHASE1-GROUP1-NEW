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
   - Enter https://taskmaster-final-punc.onrender.com/
   - or use http://localhost:3000/ if running locally

## Using the website
You can register a username and password to log-in and access the Plan and Task pages.

Alternatively, you can use these combinations as sample users.
| Username | Password |
| --- | --- |
| judilee | testPassword1 |
| jerome | testPassword2 |
| marc | testPassword3 |
| username4 | testPassword4 |
| username5 | testPassword5 |

These accounts come with sample tasks and notifications (found in sample_data) in the database to get an idea of how the website will look like.

## Plan Page
The plan page contains a calendar for a user to see all their tasks for the month more conveniently.
The left side of the page is focused for tasks while the right side of the page shows the notifications set by the user.
A user is also able to view a task in detail, as well as edit and delete both tasks and notifications.
##
![Plan Image](https://github.com/hcris2/CCAPDEV-PHASE1-GROUP1-NEW/blob/main/CCAPDEV-Phase1-Group1/styles/Plan-Page.jpg)

## Task Page
The task page is the place to view, edit, and delete tasks in more detail. Users can add a task with the button on the left side and edit tasks one the right side once they are selected. The current task selected on the right side will also update when a user clicks on a task.
##
![Plan Image](https://github.com/hcris2/CCAPDEV-PHASE1-GROUP1-NEW/blob/main/CCAPDEV-Phase1-Group1/styles/Task-Page.jpg)


