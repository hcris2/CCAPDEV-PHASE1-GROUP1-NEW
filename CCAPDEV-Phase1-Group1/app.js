const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
  console.log('Request url: ' + req.url);

  // Set the content type to HTML
  res.setHeader('Content-Type', 'text/html');

  // Serve different HTML files based on the request URL
  if (req.url === '/register.html') {
    // Read the register.html file
    fs.readFile(path.join(__dirname, 'CCAPDEV-Phase1-Group1', 'index.html'), 'utf8', (err, data) => {
      if (err) {
        res.statusCode = 500;
        res.end('Internal Server Error');
        console.error('Error reading register.html:', err);
      } else {
        res.statusCode = 200;
        res.end(data);
      }
    });
  } else if (req.url === '/plan.html') {
    // Read the plan.html file
    fs.readFile(path.join(__dirname, 'plan.html'), 'utf8', (err, data) => {
      if (err) {
        res.statusCode = 500;
        res.end('Internal Server Error');
        console.error('Error reading plan.html:', err);
      } else {
        res.statusCode = 200;
        res.end(data);
      }
    });
  } else if (req.url === '/task_page.html') {
    // Read the task_page.html file
    fs.readFile(path.join(__dirname, 'task_page.html'), 'utf8', (err, data) => {
      if (err) {
        res.statusCode = 500;
        res.end('Internal Server Error');
        console.error('Error reading task_page.html:', err);
      } else {
        res.statusCode = 200;
        res.end(data);
      }
    });
  } else {
    // Read the index.html file
    fs.readFile(path.join(__dirname, 'index.html'), 'utf8', (err, data) => {
      if (err) {
        res.statusCode = 500;
        res.end('Internal Server Error');
        console.error('Error reading index.html:', err);
      } else {
        res.statusCode = 200;
        res.end(data);
      }
    });
  }
});

server.listen(3000, 'localhost', () => {
  console.log('Server listening...');
});
