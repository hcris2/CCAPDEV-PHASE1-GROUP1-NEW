const express = require('express');
const path = require('path');
const router = express.Router();

router.use(express.json());
router.use(express.urlencoded({extended:false}))


router.get('/index.js',  (req,res) => {
    const indexPath = path.join(__dirname, '../javascript', 'index.js');
    res.sendFile(indexPath);
})

router.get('/user.js',  (req,res) => {
    const indexPath = path.join(__dirname, '../javascript', 'user.js');
    res.sendFile(indexPath);
})

router.get('/plan.js',  (req,res) => {
    const indexPath = path.join(__dirname, '../javascript', 'plan.js');
    res.sendFile(indexPath);
})


router.get('/task_page.js',  (req,res) => {
    const indexPath = path.join(__dirname, '../javascript', 'task_page.js');
    res.sendFile(indexPath);
})

module.exports = router;