/* eslint-disable linebreak-style */
/* eslint-disable quotes */
/* eslint-disable comma-dangle */
// const serverPort = import.meta.env.VITE_API_SERVER_PORT;
const portServer = 4000;

const http = require("http");

const app = require("./app");

app.set(portServer);

const server = http.createServer(app);

server.listen(portServer);
