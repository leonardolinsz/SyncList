const express = require('express');
const router = express.Router();
const Tarefa = require('../models/Tarefa');

router.get('/', async (req, res) => {
  const tarefas = await Tarefa.find();
  res.json(tarefas);
});

router.post('/', async (req, res) => {
  const { titulo, descricao } = req.body;
  const nova = new Tarefa({ titulo, descricao });
  await nova.save();
  res.json(nova);
});

router.patch('/:id/concluir', async (req, res) => {
  const tarefa = await Tarefa.findByIdAndUpdate(
    req.params.id,
    { concluida: true },
    { new: true }
  );
  res.json(tarefa);
});

router.delete('/:id', async (req, res) => {
  await Tarefa.findByIdAndDelete(req.params.id);
  res.json({ mensagem: 'Tarefa excluída' });
});

module.exports = router;
