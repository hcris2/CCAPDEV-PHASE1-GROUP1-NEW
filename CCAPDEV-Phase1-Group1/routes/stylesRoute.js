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
router.get('/about.css', (req, res) => {
    const cssPath = path.join(__dirname, '../styles', 'about.css');
    res.sendFile(cssPath);
});
router.get('/jerome.jpg', (req, res) => {
    const bgPath = path.join(__dirname, '../styles', 'jerome.jpg');
    res.sendFile(bgPath);
});
router.get('/judilee.jpg', (req, res) => {
    const bgPath = path.join(__dirname, '../styles', 'judilee.jpg');
    res.sendFile(bgPath);
});
router.get('/marc.jpg', (req, res) => {
    const bgPath = path.join(__dirname, '../styles', 'marc.jpg');
    res.sendFile(bgPath);
});

module.exports = router;
