const http = require('http');
require('dotenv').config();
const express = require('express');
const app = express();
const { StatusCodes } = require('http-status-codes');
require('express-async-errors');
const BadRequestError = require('./errors/BadRequestError');
const notFound= require('./middleware/NotFound')
const errorHandler = require('./middleware/errorHandler');
const nodePortScanner = require('node-port-scanner');
const { writeFileSync, readFileSync } = require('fs');

app.use(express.static('public'));
app.use(express.json());

const server = http.createServer(app);

app.get('/getip', async (req, res)=>{
  res.status(StatusCodes.OK).json({ok: true,ip:req.headers['x-forwarded-for'] || req.socket.remoteAddress.substring(7)});
  res.end();
})

app.post('/checkport', async(req, res)=>{
  const port = req.body.port;
    const ip = req.body.ip;
    
    if(!port){
      throw new BadRequestError('port must be specified');
    }
    if(!ip){
      throw new BadRequestError('ip must be specified');
    }
    console.log('Checking port: ' + port + ' on ' + ip);
    const openPorts = await nodePortScanner(ip,[Number(port)]);
    const isOpen = openPorts.ports.open.length != 0;
    res.status(StatusCodes.OK).json({ok:true,isOpen: isOpen});
    let contains = readFileSync('./data/checked.txt',"utf8").split("\n");
    let data = `${ip}:${port} is ${isOpen ? 'open' : 'closed'}\n`;
    for(let i = 0;i<4;i++){
      data += contains[i];
    }
    writeFileSync('./data/checked.txt', data);
})

app.get('/lastChecked', async (req, res) => {
  let contains = readFileSync('./data/checked.txt',"utf8").split("\n");
  res.status(StatusCodes.OK).json({
    ok:true,
    data:contains
  })
})

app.use(notFound);
app.use(errorHandler);

const PORT  = process.env.PORT || 1035;

server.listen(PORT,() =>{
  console.log(`app slusa na portu ${PORT}`)
})
/*
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
});*/