const express = require("express");
const app = express();
const PORT = 3000;
app.use(express.json());
const cors = require("cors");

// Cho phép tất cả (development)
app.use(cors());

app.get("/", (req, res) => {
  res.send("backend is runnging");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});