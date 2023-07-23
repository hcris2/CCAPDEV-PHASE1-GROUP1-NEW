const express = require('express');
const path = require('path');
const router = express.Router();

router.use(express.json());
router.use(express.urlencoded({extended:false}));

router.get('/index_styles.css', (req, res) => {
    const cssPath = path.join(__dirname, '../styles', 'index_styles.css');
    res.sendFile(cssPath);
});

router.get('/bgtest.jpg', (req, res) => {
    const bgPath = path.join(__dirname, '../styles', 'bgtest.jpg');
    res.sendFile(bgPath);
});

router.get('/register_styles.css', (req, res) => {
    const cssPath = path.join(__dirname, '../styles', 'register_styles.css');
    res.sendFile(cssPath);
});

router.get('/styles.css', (req, res) => {
    const cssPath = path.join(__dirname, '../styles', 'styles.css');
    res.sendFile(cssPath);
});

router.get('/task_page_styles.css', (req, res) => {
    const cssPath = path.join(__dirname, '../styles', 'task_page_styles.css');
    res.sendFile(cssPath);
});

module.exports = router;
