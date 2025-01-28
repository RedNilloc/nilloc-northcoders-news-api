const express = require("express");
const app = express();
const { getEndpoints } 
     = require("./controllers/controller")

app.get("/api", getEndpoints);

module.exports = app;
