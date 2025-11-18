const express = require("express");
const ytdl = require("ytdl-core");
const app = express();

// Endpoint principal de la API
app.get("/play", async (req, res) => {
  const url = req.query.url;
  
  if (!url) return res.status(400).send("Falta el link de YouTube");

  try {
    // Obtiene información del video
    const info = await ytdl.getInfo(url);
    const format = ytdl.chooseFormat(info.formats, { quality: "18" });

    // Devuelve el link directo del stream en JSON
    res.json({
      title: info.videoDetails.title,
      stream: format.url
    });

  } catch (e) {
    console.error(e);
    res.status(500).send("Error al obtener el video: " + e.message);
  }
});

// Servir un HTML simple para pruebas
app.use(express.static("public"));

// Inicia el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`API YOUTUBE lista en el puerto ${PORT}`);
});
