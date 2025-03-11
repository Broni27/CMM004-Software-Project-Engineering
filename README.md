### This project is split between 2 folders: Frontend and Backend, both need to be run using the instructions below in order to experience the intended effects (they can be run in any order i.e. Backend can be run first, then Frontend, and vice versa)
---

# Frontend
To be able to run the React web application:
<ol>
  <li>Have node.js installed on your computer (https://nodejs.org/en)</li>
  <li>Open the project root folder in Command Prompt</li>
  <li>Type npm i and press enter</li>
  <li>Wait until the command runs, then type npm run dev and press enter</li>
</ol>

The result should be a localhost link (usually http://localhost:5173), open this in your browser, and you can now access our web application!

## Error Troubleshooting
##### If the web application does not correctly redirect to different webpages
It is likely that a crucial file is missing:
<ol>
  <li>In the project root folder, create a new file called .env (note this should be an .env file, i.e. should have no extension)</li>
  <li>An IDE like VS Code will recognise this kind of file, but if you are creating the file in File Explorer, make sure you go to "View" at the top and check 'File name extensions' to ensure you have created the file correctly</li>
  <li>Inside the .env file type the following exactly: VITE_BASE_URL=http://localhost:5088</li>
</ol>

---

# Backend (.NET API)

This project is a backend API developed using .NET SDK 9.0. It serves as the backend for handling requests from frontend, processing data, and interacting with the database.

---

## Prerequisites

Ensure your system meets the requirements before running this application.
### 1. Install .NET 9.0 SDK
- Download and install the .NET SDK 9.0 from the official Microsoft website:
- https://dotnet.microsoft.com/en-us/download

- Verify installation by running the following command in your command line tool:
    ```
    dotnet --version
    ```

- This should return something like:
    ```
    9.0.x
    ```

---

### 2. Database
- You are not required to install any database as SQLite is used in this application.

---

## Running the Application

- After .NET 9.0 SDK is installed, run the following command in your command line tool to run the application:
1. Open project folder, cd the path to API folder, enter the following command
    ```
    dotnet run
    ```
*Alternatively, you may open the project folder in an IDE of your choice (e.g. VS Code) and directly run the Program.cs file*

2. The API will be available at:
    ```
    http://localhost:5088
    ```

3. Enter the following command to stop the server
    ```
    crtl c
    ```
    
---

# Contact

For any issues or further instructions, please contact the project development team.

---

# License

This project is licensed under MIT.

---
