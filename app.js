const http = require('http');
const url = require('url');
const {readFileSync, createReadStream } = require('fs');
const { join, extname } = require('path');
const index = join(__dirname,'index.html');
const server = http.createServer(async (req, res) => {
  const reqUrl = url.parse(req.url, true);
  const path = reqUrl.pathname;
  const params = reqUrl.query;

  switch (path) {
    case '/':
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.write(readFileSync(index));
      res.end();
      break;
    case '/getip':
      res.end(JSON.stringify({
        ok: true,
        ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress.substring(7) || null
      }))
      break;
    default:
      
      let mimetype;
      try{
        if(path === '/app.js') {
          throw new Error();
        }
        switch(extname(path.substring(1,path.length))){
          case '.js':
            mimetype = "text/javascript"
            break;
          case '.css':
            mimetype = "text/css"
            break;
          case '.html':
            mimetype = "text/html"
            break;
          case '.svg':
            mimetype = "image/svg+xml"
            break;
          case '.ico':
            mimetype = "image/x-icon"
            break;
        }
        console.log(mimetype,extname(path.substring(1,path.length)))
        res.writeHead(200, { 'Content-Type': `${mimetype}` });
        createReadStream(join(__dirname,path)).pipe(res);
        res.end();
      }catch(e){
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 error: page not found');
      }
      break;
  }
});

const port = process.env.PORT || 1035;
server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});