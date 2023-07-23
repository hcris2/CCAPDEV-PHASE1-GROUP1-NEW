const express = require('express');
const path = require('path');
const router = express.Router();

router.use(express.json());
router.use(express.urlencoded({extended:false}))

// for INDEX.html 
router.get('/index.html',  (req,res) => {
    const indexPath = path.join(__dirname, '../', 'index.html');
    res.sendFile(indexPath);
})
  
router.get('/register.html',  (req,res) => {
    const registerPath = path.join(__dirname, '../', 'register.html');
    res.sendFile(registerPath);
})

//for PLAN.html
router.get('/plan.html',  (req,res) => {
    const planPath = path.join(__dirname, '../', 'plan.html');
    res.sendFile(planPath);
})

router.get('/task_page.html',  (req,res) => {
    const taskPath = path.join(__dirname, '../', 'task_page.html');
    res.sendFile(taskPath);
})

module.exports = router;