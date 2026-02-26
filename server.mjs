import { createReadStream, existsSync } from 'node:fs';
import { extname, join, normalize } from 'node:path';
import http from 'node:http';

const port = Number(process.env.PORT || 8080);
const distRoot = join(process.cwd(), 'dist', 'omsui');
const indexFile = join(distRoot, 'index.html');

const contentTypes = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.txt': 'text/plain; charset=utf-8',
  '.map': 'application/json; charset=utf-8'
};

function sendFile(filePath, res) {
  const extension = extname(filePath).toLowerCase();
  const contentType = contentTypes[extension] || 'application/octet-stream';
  res.writeHead(200, { 'Content-Type': contentType });
  createReadStream(filePath).pipe(res);
}

const server = http.createServer((req, res) => {
  const requestedPath = (req.url || '/').split('?')[0];
  const safePath = normalize(requestedPath).replace(/^([.][.][/\\])+/, '');
  const filePath = join(distRoot, safePath === '/' ? 'index.html' : safePath);

  if (existsSync(filePath) && !filePath.endsWith('/')) {
    sendFile(filePath, res);
    return;
  }

  if (existsSync(indexFile)) {
    sendFile(indexFile, res);
    return;
  }

  res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end('Build output not found. Run "npm run build:azure" before starting server.');
});

server.listen(port, '0.0.0.0', () => {
  console.log(`OMS UI server listening on port ${port}`);
});
