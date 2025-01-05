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
app.get("/api/:dateOrTimestamp?", function (req, res) {
  const {dateOrTimestamp}=req.params

  let dateObj
  if(dateOrTimestamp){
    dateObj=new Date(/^\d+$/.test(dateOrTimestamp)?parseInt(dateOrTimestamp):dateOrTimestamp)
  }
  else{
    dateObj=new Date()  
  }
  if(dateObj.getTime()){
    let unix;
    let utc;
    unix=dateObj.getTime()
    utc=dateObj.toUTCString()
    res.json({unix,utc})
  }else{
    res.json({error:"Invalid Date"})
  }


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
