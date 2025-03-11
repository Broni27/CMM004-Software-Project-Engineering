# Frontend
To be able to run the React web application:
<ol>
  <li>Have node.js installed on your computer (https://nodejs.org/en)</li>
  <li>Open the project root folder in Command Prompt</li>
  <li>Type npm i and press enter</li>
  <li>Wait until the command runs, then type npm run dev and press enter</li>
</ol>

The result should be a localhost link, open this in your browser, and you can now access our web application!

## Error Troubleshooting
##### If the web application does not correctly redirect to different webpages
It is likely that a crucial file is missing:
<ol>
  <li>In the project root folder, create a new file called .env (note this should be an .env file, i.e. should have no extension)</li>
  <li>An IDE like VS Code will recognise this kind of file, but if you are creating the file in File Explorer, make sure you go to "View" at the top and check 'File name extensions' to ensure you have created the file correctly</li>
  <li>Inside the .env file type the following exactly: VITE_BASE_URL=http://localhost:5088</li>
</ol>
