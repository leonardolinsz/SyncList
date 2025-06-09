const mongoose = require('mongoose');

const TarefaSchema = new mongoose.Schema({
  titulo: String,
  descricao: String,
  concluida: { type: Boolean, default: false },
});

module.exports = mongoose.model('Tarefa', TarefaSchema);
