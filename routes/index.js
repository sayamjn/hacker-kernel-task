var express = require('express');
var router = express.Router();
const user = require('../models/userModel')
const task = require('../models/taskModel')
const ExcelJS = require('exceljs');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index')
});

/* GET all users page. */
router.get('/user', async function (req, res, next) {
  try {
    const users = await user.find();
    res.render('user', { user: users });
  } catch (err) {
    console.log(err);
    res.status(500).send('Internal server error');
  }
});


/* POST create new user. */
router.post('/user', async (req, res) => {
  try {
        // Validate email  using JavaScript
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(req.body.email)) {
      return res.status(400).send('Invalid email');
    }
  
    // Validate mobile number using JavaScript
    // const mobileRegex = /^\d{10}$/;
    // if (!mobileRegex.test(req.body.number)) {
    //   return res.status(400).send('Invalid mobile number');
    // }

    const User = new user({
      name: req.body.name,
      email: req.body.email,
      number: req.body.number,
    });

    await User.save();
    res.redirect('/user');
  } catch (err) {
    console.log(err);
    res.status(400).send(err.message);
  }
});




/* GET all tasks page. */
router.get('/task', async function(req, res, next) {
  try {
    const users = await user.find().populate('task');
    const tasks = await task.find().populate('user');
    res.render('task', { task: tasks,user:users });
  } catch (err) {
    console.log(err);
    res.status(500).send('Internal server error');
  }
});


/* POST create new task. */
router.post('/task', function(req, res, next) {
  user.find().then((user) => {
    task.create({
      task: req.body.task,
      type: req.body.type,
      user: req.body.user,
    }).then((newtask)=>{
      res.redirect("/task");
    }).catch((err)=>{
      console.log(err);
    });
  }).catch((err) => {
    console.log(err);
  });
});



/* GET User page with specific users. */
router.get('/user/:email', function (req, res, next) {  
  const email = req.params.email;
    res.redirect("/task")

  })
  


/* GET export page with excel. */
router.get('/export', function(req, res, next) {
  var workbook = new ExcelJS.Workbook();
  var userSheet = workbook.addWorksheet('Users');
  var taskSheet = workbook.addWorksheet('Tasks');
  
  userSheet.columns = [
    { header: 'ID', key: '_id', width: 20 },
    { header: 'Name', key: 'name', width: 20 },
    { header: 'Email', key: 'email', width: 40 },
    { header: 'Mobile', key: 'number', width: 20 },
  ];

  taskSheet.columns = [
    { header: 'ID', key: '_id', width: 20 },
    { header: 'Task Name', key: 'task', width: 20 },
    { header: 'Task Type', key: 'type', width: 20 },
    { header: 'taskfor_ID', key: 'user' },
  ];

  user.find().then((alluser) => {
    userSheet.addRows(alluser);
    task.find().then((alltask) => {
      taskSheet.addRows(alltask);
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename=' + 'users-tasks.xlsx');
      return workbook.xlsx.write(res).then(function () {
        res.status(200).end();
      });
    }).catch((err) => {
      console.log(err)
    })
  }).catch((err) => {
    res.send(err)
  })
});


module.exports = router