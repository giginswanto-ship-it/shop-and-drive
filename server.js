/**
 * SISTEM MONITORING KEUANGAN BENGKEL TERPADU
 * Local Database Server (Node.js Built-in Modules - Zero Dependency)
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const DB_FILE = path.join(__dirname, 'database.json');

// MIME Types
const MIME_TYPES = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.svg': 'image/svg+xml'
};

const server = http.createServer((req, res) => {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    // API: GET /api/db (Read full database)
    if (req.url === '/api/db' && req.method === 'GET') {
        if (fs.existsSync(DB_FILE)) {
            try {
                const data = fs.readFileSync(DB_FILE, 'utf8');
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(data);
                return;
            } catch (err) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: err.message }));
                return;
            }
        } else {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Database file not created yet' }));
            return;
        }
    }

    // API: POST /api/db (Save full database to disk)
    if (req.url === '/api/db' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            try {
                // Verify valid JSON
                const parsed = JSON.parse(body);
                parsed.lastSavedAt = new Date().toISOString();
                fs.writeFileSync(DB_FILE, JSON.stringify(parsed, null, 2), 'utf8');
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true, message: 'Database berhasil disimpan ke disk!', savedAt: parsed.lastSavedAt }));
            } catch (err) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Invalid JSON: ' + err.message }));
            }
        });
        return;
    }

    // Static File Serving
    let reqPath = req.url.split('?')[0];
    if (reqPath === '/' || reqPath === '') reqPath = '/index.html';
    const filePath = path.join(__dirname, reqPath);
    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    fs.readFile(filePath, (err, content) => {
        if (err) {
            if (err.code === 'ENOENT') {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('404 Not Found');
            } else {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('500 Server Error: ' + err.code);
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content);
        }
    });
});

server.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(` SERVER MONITOR KEUANGAN BENGKEL AKTIF`);
    console.log(` URL: http://localhost:${PORT}`);
    console.log(` DATABASE FILE: ${DB_FILE}`);
    console.log(`=======================================================`);
});
