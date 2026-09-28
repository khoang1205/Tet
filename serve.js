const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');

const PORT = 5000;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.mp3': 'audio/mpeg'
};

function getLocalIp() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost';
}

const server = http.createServer((req, res) => {
  let cleanUrl = req.url.split('?')[0];
  let filePath = path.join(__dirname, cleanUrl === '/' ? 'index.html' : cleanUrl);
  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end('<h1>404 Không tìm thấy file</h1>');
      } else {
        res.writeHead(500);
        res.end(`Lỗi máy chủ: ${err.code}`);
      }
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
    }
  });
});

const localIp = getLocalIp();

server.listen(PORT, '0.0.0.0', () => {
  console.log(`\n=======================================================`);
  console.log(`🧧 Web Tết Tặng Bạn Thân Đang Chạy!`);
  console.log(`💻 Mở trên máy tính:  http://localhost:${PORT}`);
  console.log(`📱 Mở trên điện thoại: http://${localIp}:${PORT}`);
  console.log(`=======================================================\n`);
});
