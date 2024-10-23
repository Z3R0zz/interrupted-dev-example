import axios from "axios";
import "dotenv/config";
import express, { Express, Request, Response } from "express";
import path from "path";
import multer from "multer";
import { fileURLToPath } from "url";
import { ApiResponse } from "./types";
import FormData from "form-data"; // This is needed for our file upload which has a body of type FormData

const app: Express = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Set up multer to handle file uploads (Obviously you can use your own file upload handler)
const upload = multer({ storage: multer.memoryStorage() });

// Route for our homepage which will have a form for uploading files
app.get("/", (req: Request, res: Response) => {
  res.render("index");
});

app.post(
  "/upload",
  upload.single("file"),
  async (req: Request, res: Response) => {
    const file = req.file;

    if (!file) {
      res.status(400).send("No file uploaded.");
      return;
    }

    try {
      // Since our endpoint also allows us to save metadata along with the file here we can construct a description for our upload and send it along with the file
      const metadata = {
        description:
          file.originalname +
          " uploaded by anonymous user on " +
          new Date().toLocaleString(),
      };

      // This is where we construct our form data that we want to send to the interrupted dev endpoint
      const formData = new FormData();
      formData.append("file", file.buffer, {
        filename: file.originalname,
        contentType: file.mimetype, // If the mimetype is octet-stream our endpoint will try to guess the file type which may not always be accurate so it's better to set it here
      });

      // Append the metadata to the form data
      formData.append("metadata", JSON.stringify(metadata));

      // Get the content length for the request headers
      const contentLength = formData.getLengthSync();

      // Here we perform the post request to the interrupted dev endpoint
      const response = await axios.post<ApiResponse>(
        `${process.env.INT_BASE_URL}/upload`,
        formData,
        {
          headers: {
            ...formData.getHeaders(), // This sets the correct multipart headers
            "Content-Length": contentLength, // Ensure content length is set
            Authorization: "Bearer " + process.env.INTD_API_KEY, // Api key for auth
            "User-Agent": process.env.INTD_USER_AGENT,
          },
        }
      );

      // Redirect to the file's view page if the upload was successful
      res.redirect(`/u/${response.data.file.file_name}`);
    } catch (error) {
      // If something goes wrong we can return a 500 status code and an error message
      console.error(error);
      res.status(500).send("An error occurred while uploading the file.");
    }
  }
);

// This defines our route for viewing uploaded files. In production your url would be something like https://yourdomain.com/u/INSERT_FILENAME
app.get("/u/:filename", async (req: Request, res: Response) => {
  const { filename } = req.params;

  try {
    // Here we send a get request to interrupted's dev endpoint to fetch the file data
    const response = await axios.get<ApiResponse>(
      `${process.env.INT_BASE_URL}/upload/file/${filename}`,
      {
        headers: {
          Authorization: "Bearer " + process.env.INTD_API_KEY, // Api key for auth or else our request will be unauthorized
          "User-Agent": process.env.INTD_USER_AGENT,
        },
      }
    );

    const fileData = response.data.file;
    const fileUrl = response.data.url;

    // If everything goes according to plan we can render the view file and pass our data to it
    res.render("uploads", { fileData, fileUrl });
  } catch (error) {
    // Here if something goes wrong in a real world scenario you would probably want to return a 404 view or 500 view depending on the error code returned by the endpoint.
    console.error(error);
    res.sendStatus(404);
    return;
  }
});

const port = 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
