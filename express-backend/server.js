const express = require("express");
const bodyParser = require("body-parser");
const routes = require("./routes");

const allowedOrigins = ["http://127.0.0.1:5500"];

const app = express();
const PORT = 8000;


app.use((req, res, next) => {
  const origin = req.headers.origin;
  if(allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});


app.use(bodyParser.json());
app.use("/api", routes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
