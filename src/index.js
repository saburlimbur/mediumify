import express from "express"
import env from "dotenv"

env.config()

const app = express()
const PORT = process.env.PORT || 3000
const corsOptions = {
    origin: "*",
}

app.use(
    express.json({
        limit: '150mb',
    })
);

app.use(
    express.urlencoded({
        extended: 'true',
    })
);

app.get("/", (req, res) => {
    return res.json("Hello World")
})

app
    .listen(PORT, () => {
        console.log(`
      =========================================

              COOKED IN PORT ${PORT} 😎

      =========================================
        `);
    })
    .on('error', (err) => {
        console.error(`Error starting server: ${err.message}`);
    });