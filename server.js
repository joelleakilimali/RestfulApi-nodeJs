// here we are creating our server and handle everything concerning it

const http = require("http");
const app = require("./app");
const port = process.env.PORT || 3001;
const server = http.createServer(app);
server.listen(port, () => {
  console.log(`running at port ${port}`);
});
