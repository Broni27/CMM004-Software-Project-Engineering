# 📅🎉 Event Management App
This project is a full-stack application split into two main components: Frontend and Backend. The frontend is built using React, while the backend is developed using .NET 9.0. The application allows users to register, log in, create events, join events, and manage their profiles. The backend serves as an API to handle requests, process data, and interact with the SQLite database.

Both the frontend and backend need to be running simultaneously to experience the full functionality of the application. They can be started in any order.

## 📂 Project Structure
The project is organised into two main folders:

- Frontend: Contains the React web application.

- Backend: Contains the .NET API for handling requests and database interactions.

## 🚀 Features
1. User Authentication: Users can register, log in, and manage their profiles.
2. Event Management: Users can create, update, and delete events.
3. Event Participation: Users can join and leave events.
4. Profile Management: Users can view their profile details and events they’ve created or joined.
5. Role-Based Access Control: Different roles (e.g. User, Admin) are supported for access control.

## ⚙️ Technology Stack
- Frontend: React
- Backend: .NET 9.0
- Database: SQLite
- Authentication: JSON Web Tokens (JWT)
- Password Hashing: HMACSHA512

## 🗂️ Database Design
The database consists of the following tables:

1. User: Stores user information (e.g., username, email, password hash, role).
2. Event: Stores event details (e.g., title, description, date, location, capacity).
3. UserEvent: A join table for the many-to-many relationship between users and events.
### Entity Relationships
- User ↔ Event: One-to-Many (A user can create multiple events).
- User ↔ Event: Many-to-Many (A user can join multiple events, and an event can have multiple participants).

## 📦 Installation
### Frontend (React)
To be able to run the React web application:
<ol>
  <li>Have node.js installed on your computer (https://nodejs.org/en)</li>
  <li>Open the project root folder in Command Prompt</li>
  <li>Type npm i and press enter</li>
  <li>Wait until the command runs, then type npm run dev and press enter</li>
</ol>

The result should be a localhost link (usually http://localhost:5173), open this in your browser, and you can now access our web application!

### Error Troubleshooting
##### If the web application does not correctly redirect to different webpages
It is likely that a crucial file is missing:
<ol>
  <li>In the project root folder, create a new file called .env (note this should be an .env file, i.e. should have no extension)</li>
  <li>An IDE like VS Code will recognise this kind of file, but if you are creating the file in File Explorer, make sure you go to "View" at the top and check 'File name extensions' to ensure you have created the file correctly</li>
  <li>Inside the .env file type the following exactly: VITE_BASE_URL=http://localhost:5088</li>
</ol>


### Backend (.NET API)
#### 1. Install .NET 9.0 SDK
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

#### 2. Running the Application

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
## 📑 API Endpoints Overview
| Endpoint | Method | Description |
|-------------------------------|----------|-----------------------------------------|
| /api/account/login            | POST     | User login                              |
| /api/account/register         | POST     | User register                           |  
| /api/account/profile          | GET      | Retrieves user's profile                |
| /api/event                    | GET      | Retrieves all events                    |
| /api/event/{id}               | GET      | Retrieves a specific event by ID        |
| /api/event/created            | GET      | Retrieves all events user has created   |
| /api/event                    | POST     | Creates a new event                     |
| /api/event/{id}               | PUT      | Updates an existing event               |
| /api/event/{id}               | DELETE   | Deletes an event                        |
| /api/userevent/join/{eventId} | POST     | Allows a user to join an event          |
| /api/userevent/joined         | GET      | Retrieves all events joined by the user |
| /api/userevent/leave/{eventId}| DELETE   | Allows a user to leave an event         |

## 🔒 Security Highlights
- JWT Authentication: Secure token-based authentication for user sessions.
- Password Hashing: Passwords are hashed using HMACSHA512 for secure storage.
- Role-Based Access Control: Ensures users can only perform actions they are authorised for.
- Input Validation: All user inputs are validated to prevent malicious data.

## 👨‍💻 Contact

For any issues or further instructions, please contact the project development team.

## 📃 License

This project is licensed under MIT.

