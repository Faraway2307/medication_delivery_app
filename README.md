# Medication Delivery App
A user-friendly app to assist people with disabilities in remotely ordering and delivering medications to their homes. 

# INF2003 Project
 
##### Overview
This repository contains the code for the INF2003 Project. The project is divided into two parts: Frontend and Backend. The frontend is built using Angular, and the backend is implemented using Node.js. PostgreSQL is used as our relational database and MongoDB is used as our non-relational database in this project.


##### Prerequisites
Before running the project, make sure you have the following installed on your system:

Node.js: Install Node.js from the official website https://nodejs.org/en/download.

Mongodb: Install Mongodb.msi from the official website https://www.mongodb.com/try/download/community.
(If the installation gets stuck, cancel the installation and select custom installation. Click next until you see an option for "Install MongoDB Compass" and uncheck this option.)

Mongosh(optional): Install Mongosh from the official website https://www.mongodb.com/docs/mongodb-shell/install/. Mongosh provides an easy way to see whether data has successfully been uploaded. The default port used is: 27017. Data should be stored in "stock".

Angular: Run `npm install -g @angular/cli` in your terminal to install Angular, this must be done after you have installed Node.js . 

PostgreSQL: Download from the website https://www.postgresql.org/download/ , ensure that pgAdmin4 is downloaded with it as well, comes together .


##### Installation 
1. Clone this repository to your local machine using the following command: `git clone https://github.com/joycexzz/INF2003-DBMS-Project.git` .

2. Open a terminal or command prompt and navigate to the my-app directory in the cloned repository.

3. Run the following command to install all the necessary packages for the frontend: `npm install` , `npm install @auth0/angular-jwt` .
   
4. Navigate to the directory of the backend and run the following command: `npm install cors` , `npm install bcrypt` , `npm install express` , `npm install jsonwebtoken`.


#### Setting up the project 
1.  In pgAdmin4(comes with PostgreSQL download) enter your server and under localhost, create a database called "test". If you want to create with a different database navigate to the source code directory and find connection.js, change the database field name to your desired choice.
   
2.  After creating your database, navigate to the backend and run in your terminal the command `node tablecreation.js` to create your table in the database.

3.  Go back to pgAdmin4 and navigate to your Servers  >> localhost >> dbname >> Schemas >>
public >> tables. 

4.  Right click user table first and click export, in General select the file that we've provided and the file type which is '.csv' . In the source folder, for this table we choose users.csv, enable the header under Option. Under columns in "Columns to import" ensure the order is in `userid,role,nric,password` , if not rearrange them again by deleting and readding in order. In the same options, in the NOT NULL columns choose userid and nric. 
   
5.  Similar to step 4, but with admin table using admin.csv . NOT NULL columns are did,nric and user_id, "Columns to import" order must follow the arrangment of the .csv columns.

6.  Similar to step 4, but with encounter table using encounters.csv . NOT NULL columns are encounterid,pid and doctorid, "Columns to import" order must follow the arrangment of the  columns.
   
7.  Repeat the same steps but with medication table using medication.csv . NOT NULL columns is medcode, "Columns to import" order must follow the arrangment of the  columns.
   
8.  Repeat the same steps but with medicationorder table using medicationorder.csv. NOT NULL columns is orderid,pid,encounterid,medcode,doctorid, "Columns to import" order must follow the arrangment of the  columns.

9.  Press Alt+Shift+Q and enter the following queries :
    - SELECT pg_catalog.setval(pg_get_serial_sequence('users', 'userid'), (SELECT MAX(userid) FROM users));
    - SELECT pg_catalog.setval(pg_get_serial_sequence('admin', 'did'), (SELECT MAX(did) FROM admin));
    - SELECT pg_catalog.setval(pg_get_serial_sequence('medicationorder', 'orderid'), (SELECT MAX(orderid) FROM medicationorder));
    - SELECT pg_catalog.setval(pg_get_serial_sequence('medication', 'medcode'), (SELECT MAX(medcode) FROM medication));
    - SELECT pg_catalog.setval(pg_get_serial_sequence('patient', 'pid'), (SELECT MAX(pid) FROM patient));


    into your Query and press F5 or the play button to execute. Your database is now loaded.


##### Running the Project 
Frontend

1. To run the frontend, make sure you are in the frontend directory.
2. Execute the following command to start the development server: `ng serve`

This will build and serve the frontend on http://localhost:4200/.

Backend
1. To run the backend, navigate to the backend folder.
2. Execute the following command to start the backend server: `node api.js`
The backend server will be running on http://localhost:3000/
3. Execute the following command to start the MongoDB connection: `node server.js`
The MongoDB connection will be running on http://localhost:8000/

After running front end and backend
1. Upon arrival at the website http://localhost:4200/ you will be at the login page . Navigate to users table in pgAdmin4, right click it and select "View/Edit Data" and then "All Rows". Select whichever account you want to login with the NRIC. Since the password is salt and hashed the default password for every account is P@ssword. Take note this is for testing purposes only and in reality each account password serves differently.

