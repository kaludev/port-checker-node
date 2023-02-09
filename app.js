const http = require('http');
const url = require('url');

const server = http.createServer((req, res) => {
  const reqUrl = url.parse(req.url, true);
  const path = reqUrl.pathname;
  const params = reqUrl.query;

  switch (path) {
    case '/':
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end('Welcome to the home page');
      break;
    case '/getip':
        res.end(JSON.stringify({
            ok: true,
            ip: req.socket.remoteAddress
        }))
      break;
    default:
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 error: page not found');
      break;
  }
});

const port = process.env.PORT || 5000;
server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});