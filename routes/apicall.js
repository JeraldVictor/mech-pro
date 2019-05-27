var https = require("http");

var options = {
  method: "POST",
  host: "192.168.1.131",
  port: "3007",
  path: "/inventory/component",
  headers: {
    "Content-Type": "application/json"
  }
};

var req = https.request(options, function(res) {
  var chunks = [];

  res.on("data", function(chunk) {
    chunks.push(chunk);
  });

  res.on("end", function(chunk) {
    var body = Buffer.concat(chunks);
    console.log(body.toString());
  });

  res.on("error", function(error) {
    console.error(error);
  });
});

var postData =
  '{\n"componentName":"TEST DATA FROM WEB CALL",\n"measurement":"MM",\n"quantity":"900"\n}';

req.write(postData);

req.end();
