// index.js
// where your node app starts

// init project
var express = require('express');
var app = express();

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


// your first API endpoint... 
app.get("/api/:dateOrTimestamp", function (req, res) {
  let unix;
  let utc;
  const dateObj=new Date(/^\d+$/.test(req.params.dateOrTimestamp)?parseInt(req.params.dateOrTimestamp):req.params.dateOrTimestamp)
  unix=dateObj.getTime()
  utc=dateObj.toUTCString()
  res.json({unix,utc})

  return
  // assume that it is timestamp if it is pure num
  if(/^\d+$/.test(req.params.dateOrTimestamp)){
    unix=req.params.dateOrTimestamp
    utc=new Date(utc).toUTCString()
    
  }else{
    utc=new Date()
  }
});



// Listen on port set in environment variable or default to 3000
var listener = app.listen(process.env.PORT || 3000, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
