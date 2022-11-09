// here we are creating our server and handle everything concerning it
require("dotenv").config();

const http = require("http");
const app = require("./app");
const port = process.env.PORT || 3002;
const server = http.createServer(app);
server.listen(port, () => {
  console.log(`running at port ${port}`);
});
