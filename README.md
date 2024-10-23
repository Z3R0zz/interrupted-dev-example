# Interrupted Developer API Example
This project demonstrates how to interact with the Interrupted.me's developer API for file uploads. It is built using Express.js, TypeScript, and EJS, providing a basic interface for uploading files and retrieving them.

## Features
- File upload with metadata (using multer for handling file uploads).
- Integration with [dev.interrpted.me](https://interrupted.me/) API for file uploads and retrieval.
- Rendering dynamic pages using EJS.

## Prerequisites
Before you can run this project, make sure you have the following:

- Node.js (v16.x or higher)
- TypeScript (installed globally)
## Setup
### 1. Clone the repository

  ```bash
  git clone https://github.com/Z3R0zz/interrupted-dev-example.git
  cd interrupted-dev-example
  ```
### 2. Install dependencies Run the following command to install all project dependencies:

  ```bash
  npm install
  ```
### 3. Environment variables

- Copy the `.env.example` file and rename it to `.env.`
- Update the variables with your own credentials:
```makefile
INTD_BASE_URL="https://dev.interrupted.me"

INTD_API_KEY="YOUR_API_KEY"
INTD_USER_AGENT="YOUR_USER_AGENT"
```
## Development
To run the project in development mode:

```bash
npm run dev
```
This will start the server with hot-reloading enabled. The app will be available at http://localhost:5000.

## Build for Production
To build the project:

```bash
npm run build
```
This will compile the TypeScript files and copy the views folder into the dist/ directory.

## Running the Application
After building, you can start the application with:

```bash
npm start
```
This will run the compiled JavaScript files in the dist/ folder.

## Usage
### Uploading a File
1. Visit http://localhost:5000 to access the upload form.
2. Select a file and submit the form. The file, along with its metadata, will be uploaded to the Interrupted.me API.
3. If successful, you will be redirected to a page where you can view the uploaded file.
### Viewing Uploaded Files
Uploaded files can be accessed via http://localhost:5000/u/:filename. Replace :filename with the actual filename returned from the API after a successful upload.

## License
This project is licensed under the MIT License.
