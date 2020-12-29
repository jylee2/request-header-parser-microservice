// server.js
// where your node app starts

// init project
var express = require('express');
var app = express();

// Use body-parser to Parse POST requests
//const bodyParser = require("body-parser");

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
var cors = require('cors');
app.use(cors({optionsSuccessStatus: 200}));  // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});

// listen for requests
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});

//
// A native NodeJS API for the GeoLite data from MaxMind
const geoip = require('geoip-lite');

app.get("/api/whoami", (request, response) => {
  // Get client's IP address as a string
  const ipAdd = request["ip"];
  // Remove the ::ffff: in front for Internet Protocol Version 4
  const ipv4Add = ipAdd.replace("::ffff:","");
  // Turn it into a human readable string
  //ipAdd = geoip.pretty(ipAdd);

  // Test
  //const ip = "207.97.227.239"; // US
  //const ip = "54.255.173.121"; // SG
  //console.log(typeof(ip));
  //const geo = geoip.lookup(ip);

  // Find the IP address, if not found then geo = null
  const geo = geoip.lookup(ipAdd);
  //console.log(geo);

  response.json({
    // Get the client's IP address
    // JSON.stringify() method converts a JavaScript object or value to a JSON string
    ipaddress: ipAdd,
    //ipaddress: request.connection.remoteAddress,
    // Get the language/locale the user has set in his browser
    language: request.headers["accept-language"],
    // Get client's browser info
    software: request.headers["user-agent"],
    ipv4: ipv4Add,

    // Additional
    // Show the headers
    //headers: request.headers,

    // Get client's location
    country: ( (geo) ? geo["country"] : "Not Found"),
    region: ( (geo) ? geo["region"] : "Not Found"),
    city: ( (geo) ? geo["city"] : "Not Found"),
    metro: ( (geo) ? geo["metro"] : "Not Found"),
    area: ( (geo) ? geo["area"] : "Not Found"),
    latlong: ( (geo) ? geo["ll"] : "Not Found")
  });
});