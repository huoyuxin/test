var PORT = 8081;

var http = require("http");
var fs = require("fs");
var url = require("url");

http
  .createServer(function(request, response) {
    var parsedURL = url.parse(request.url, true);
    var pathname = parsedURL.pathname;
    if (pathname === "/events.php") {
      response.writeHead(200, {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-store",
        "Access-Control-Allow-Origin": "*"
      });

      var padding = new Array(2049);
      response.write(":" + padding.join(" ") + "\n"); // 2kB padding for IE
      response.write("retry: 2000\n");

      var lastEventId =
        Number(request.headers["last-event-id"]) ||
        Number(parsedURL.query.lastEventId) ||
        0;

      var timeoutId = 0;
      var i = lastEventId;
      var c = i + 100;
      var f = function() {
        if (++i < c) {
          response.write("id: " + i + "\n");
          response.write("data: " + i + "\n\n");
          timeoutId = setTimeout(f, 1000);
        } else {
          response.end();
        }
      };

      f();

      response.on("close", function() {
        clearTimeout(timeoutId);
      });
    } else {
      if (pathname === "/") {
        pathname = "/index.html";
      }
      if (pathname === "/index.html" || pathname === "../src/eventsource.js") {
        response.writeHead(200, {
          "Content-Type":
            pathname === "/index.html" ? "text/html" : "text/javascript"
        });
        response.write(fs.readFileSync(__dirname + pathname));
      }
      response.end();
    }
  })
  .listen(PORT);
