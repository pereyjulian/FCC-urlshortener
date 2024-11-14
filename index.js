require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.urlencoded({extended: true}))

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

//{
//  "original_url":"https://google.com",
//    "short_url":40
//}

const originalUrls = []
const shortUrls = []

app.post("/api/shorturl", (req, res) => {
  const url = req.body.url
  const foundIndex = originalUrls.indexOf(url)

if(!url.includes("http://") && !url.includes("https://")) {
  return res.json({ error: "invalid url" })
}
  
  if (foundIndex <0) {
    originalUrls.push(url)
    shortUrls.push(shortUrls.length)

    return res.json({
      original_url: url,
      short_url: shortUrls.length - 1
    })
  }

  return res.json({
    original_url: url,
    short_url: shortUrls[foundIndex]
  })
})

app.get("/api/shorturl/:short_url", (req, res) => {
  const shortUrl = parseInt(req.params.short_url)
  const foundIndex = shortUrls.indexOf(shortUrl)

  if(foundIndex < 0) {
   return res.json({
     "error": "No short URL found for the given input"
   })
  }

  res.redirect(originalUrls[foundIndex]) 
})

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
