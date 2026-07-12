const express = require("express");
const cors = require("cors");

const uploadRoute = require("./routes/upload");
const importRoute = require("./routes/import");
const app = express();

app.use(cors());
app.use(express.json());

app.use("/upload", uploadRoute);
app.use("/import", importRoute);

app.get("/", (req, res) => {
  res.send("GrowEasy Backend Running 🚀");
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});