const http = require("http");
const url = require("url");
const fs = require("fs");
const mime = require("mime-types");
const path = require("path");
const config = require("./config");

const server = http
  .createServer(function (req, res) {
    console.log("req url: " + req.url);
    let path;
    let p = "index.html";
    if (req.url === "/") {
      path = "./public/" + p;
    } else {
      path = "public" + req.url;
    }
    serve(path, res);
  })
  .listen(config.LocalPort);

function serve(path, response) {
  fs.exists(path, function (exists) {
    if (exists) {
      fs.readFile(path, function (err, data) {
        if (err) {
          console.log("Serve error: fs read error");
          send404(response);
        } else {
          console.log("Found request path " + path);
          sendFile(response, path, data);
        }
      });
    } else {
      console.log("Not found req path " + path);
      send404(response);
    }
  });
}

function send404(response) {
  response.writeHead(404, { "Content-Type": "text/plain" });
  response.write("Error 404: resource not found.");
  response.end();
}

function sendFile(response, filePath, fileContents) {
  response.writeHead(200, {
    "content-type": mime.lookup(path.basename(filePath)),
  });
  response.end(fileContents);
}

require("./RiotApiController.js").start(server, config);
