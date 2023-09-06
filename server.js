/* eslint-disable linebreak-style */
/* eslint-disable quotes */
/* eslint-disable comma-dangle */

require("dotenv").config();

const portServer = process.env.VITE_SERVER_PORT;

const http = require("http");

const app = require("./app");

app.set(portServer);

const server = http.createServer(app);

server.listen(portServer);
