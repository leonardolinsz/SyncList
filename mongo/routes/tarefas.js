const express = require('express');
const router = express.Router();
const tarefasRoutes = require('../models/Tarefa');

router.get('/', async (req, res) => {
  try {
    const tarefas = await tarefasRoutes.find();
    res.json(tarefas);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
