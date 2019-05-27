var fs = require("fs");
var parse = require("csv-parse");
var https = require("http");
var request = require("request");

var csvData = [];
var inputFile = "../db/mechanoUpdatedComponentList.csv";

//read from csv
var reader = (data, callback) => {
  fs.createReadStream(data)
    .pipe(parse({ delimiter: "," }))
    .on("data", function(csvrow) {
      // console.log(csvrow[0] + " " + csvrow[1]);
      var postData = `{"componentName":"${
        csvrow[0]
      }","measurement":"MM","quantity":"${csvrow[1]}"}`;
      csvData.push(postData);
    })
    .on("end", function() {
      callback("Done", "");
    });
};

//read csv function invoker and write to POST
reader(inputFile, (data, err) => {
  console.log(data);
  console.log(csvData.length);
  for (var i = 1; i < csvData.length; i++) {
    // console.log(csvData[i]);
    idata = JSON.parse(csvData[i]);
    var options = {
      method: "post",
      url: "http://192.168.1.131:3007/inventory/component",
      body: idata,
      json: true
    };

    request(options, function(err, res, body) {
      console.log("statusCode: ", res.statusCode);
    });
  }
});
