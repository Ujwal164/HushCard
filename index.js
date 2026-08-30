import express from "express";
import ejs from 'ejs';
import axios from "axios";
import path from "path";
import { fileURLToPath } from "url";

// 1. Define absolute paths required for ES Modules on Vercel
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000; // Use Vercel's environment port

// 2. Explicitly link EJS and the absolute views path
app.engine('ejs', ejs.__express);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// 3. Serve static assets using an absolute path
app.use(express.static(path.join(__dirname, "public")));

app.get("/", async (req, res) => {
    try {
        const result = await axios.get("https://secrets-api.appbrewery.com/random");
        
        // Use just the view name since the engine and path are explicitly set above
        res.render("index", { 
            secret: result.data.secret,
            user: result.data.username,
         });
    } catch (error) {
        // Detailed error logging to see exactly why an API call might fail
        console.error("Error breakdown:", error.response?.data || error.message);
        res.status(500).send("Error fetching random secret: " + error.message);
    }
});

// 4. Export the app for Vercel's serverless handler instead of locking it to app.listen
if (process.env.NODE_ENV !== 'production') {
    app.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`);
    });
}

export default app;
