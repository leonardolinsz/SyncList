const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const tarefasRoutes = require('./mongo/routes/tarefas');

require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/tarefas', tarefasRoutes);

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Conectado ao MongoDB');
    app.listen(process.env.PORT || 3000, () => {
      console.log(`Servidor rodando na porta ${process.env.PORT || 3000}`);
    });
  })
  .catch(err => console.error(err));