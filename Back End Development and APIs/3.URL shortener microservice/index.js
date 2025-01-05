require('dotenv').config();
const express = require('express');
const bodyParser = require("body-parser")
const cors = require('cors');
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }))
app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function (req, res) {
  res.json({ greeting: 'hello API' });
});
const code2url = {}
app.route("/api/shorturl/:code?").post((req, res) => {
  const { url } = req.body
  if (!/^https?:\/\//.test(url)) {
    res.json({ error: "Invalid URL" }); return
  } else {
    const max = Object.keys(code2url).length ? Math.max(...Object.keys(code2url).map(Number)) : 0
    const next=max+1
    code2url[next] = url
    res.json({original_url:url,short_url:next})
  }
})
.get((req,res)=>{
  const {code}=req.params
  if(!code2url[code]){
    res.redirect("http://google.com");return
  }
  res.redirect(code2url[code])
})

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
