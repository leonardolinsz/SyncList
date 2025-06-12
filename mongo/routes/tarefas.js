const express = require('express');
const router = express.Router();
const Tarefa = require('../models/Tarefa');  

router.get('/', async (req, res) => {
  try {
    const tarefas = await Tarefa.find();
    res.json(tarefas);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { titulo, descricao } = req.body;
    const novaTarefa = new Tarefa({ titulo, descricao, concluida: false });
    await novaTarefa.save();
    res.status(200).json(novaTarefa);
  } catch (error) {
    console.error('Erro ao criar tarefa:', error);
    res.status(500).json({ erro: 'Erro ao criar tarefa' });
  }
});

router.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { concluida } = req.body; 

    const tarefaAtualizada = await Tarefa.findByIdAndUpdate(
      id,
      { concluida: concluida },
      { new: true } 
    );

    if (!tarefaAtualizada) {
      return res.status(404).json({ erro: 'Tarefa não encontrada' });
    }

    res.json(tarefaAtualizada);
  } catch (error) {
    console.error('Erro ao atualizar tarefa:', error);
    res.status(500).json({ erro: 'Erro ao atualizar tarefa' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
      const { id } = req.params;
      const tarefa = await Tarefa.findByIdAndDelete(id);
      if (!tarefa) {
          return res.status(404).json({ mensagem: 'Tarefa não encontrada' });
      }
      res.status(200).json({ mensagem: 'Tarefa excluída com sucesso' });
  } catch (erro) {
      res.status(500).json({ mensagem: 'Erro ao excluir tarefa', erro });
  }
});

module.exports = router;