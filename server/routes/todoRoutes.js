const express = require('express');
const router = express.Router();
const todoController = require('../controllers/todoController');

router.get('/', todoController.getAllLists);
router.post('/', todoController.createList);
router.post('/id', todoController.updateTodoName);
router.delete('/delete', todoController.deleteLists);



module.exports = router;