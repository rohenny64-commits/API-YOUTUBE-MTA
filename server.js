const express = require("express");
const cors = require("cors");
const { spawn } = require("child_process");

const app = express();
app.use(cors());

app.get("/", (req, res) => {
    res.send("API YouTube MTA funcionando.");
});

app.get("/play", (req, res) => {
    const url = req.query.url;

    if (!url) {
        return res.status(400).send("Falta ?url=");
    }

    res.setHeader("Content-Type", "video/mp4");

    const process = spawn("yt-dlp", [
        "-f", "mp4",
        "-o", "-",
        url
    ]);

    process.stdout.pipe(res);

    process.stderr.on("data", data => {
        console.log("ERROR:", data.toString());
    });

    process.on("close", () => {
        res.end();
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log("API lista en puerto " + PORT);
});