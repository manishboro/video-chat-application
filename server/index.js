"use strict";
exports.__esModule = true;
var dotenv = require("dotenv");
var app_1 = require("./app");
dotenv.config({ path: "./config.env" });
// Check whether env variables initialized or not
if (!process.env.PORT)
    process.exit(1);
console.log("Environment :", process.env.NODE_ENV);
var PORT = parseInt(process.env.PORT, 10);
app_1.httpServer.listen(PORT, function () { return console.log("Server running on port " + PORT); });
