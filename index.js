import express from "express";
import ejs from 'ejs';
import axios from "axios";
const app = express();
const port = 3000;

app.use(express.static("public"));

app.get("/", async (req, res) => {
    try {
        const result = await axios.get("https://secrets-api.appbrewery.com/random");
        res.render("index.ejs", { 
            secret: result.data.secret,
            user: result.data.username,
         });
    } catch (error) {
        console.error("Error fetching random secret:", error);
        res.status(500).send("Error fetching random secret");
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
