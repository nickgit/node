fixed = ""
for (var i = 0; i < 20*1024; i++) {
  fixed += "C";
}
stored = {};
new node.http.Server(function (msg) {
  var commands = msg.uri.split("/");
  var command = commands[1];
  var body = "";
  var arg = commands[2];
  var status = 200;

  //p(msg.headers);

  if (command == "bytes") {
    var n = parseInt(arg, 10)
    if (n <= 0)
      throw "bytes called with n <= 0" 
    if (stored[n] === undefined) {
      puts("create stored[n]");
      stored[n] = "";
      for (var i = 0; i < n; i++) {
        stored[n] += "C"
      }
    }
    body = stored[n];

  } else if (command == "quit") {
    msg.connection.server.close();
    body = "quitting";

  } else if (command == "fixed") {
    body = fixed;

  } else {
    status = 404;
    body = "not found\n";
  }

  var content_length = body.length.toString();

  msg.sendHeader( status 
                , [ ["Content-Type", "text/plain"]
                  , ["Content-Length", content_length]
                  ]
                );
  msg.sendBody(body);
          
  msg.finish();
}).listen(8000);
