const express = require('express');
const path = require('path');

const app = express()

app.get('/', (req,res) => {
    const indexPath = path.join(__dirname, 'index.html');
    res.sendFile(indexPath);
})
app.get('/styles/index_styles.css', (req, res) => {
    const cssPath = path.join(__dirname, 'styles', 'index_styles.css');
    res.sendFile(cssPath);
  });

app.listen(3000, () => {
     console.log('Hello Listening at http://localhost:3000')
})
