require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const tarefasRoutes = require('./mongo/routes/tarefas');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/tarefas', tarefasRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Conectado ao MongoDB');
    app.listen(process.env.PORT, () =>
      console.log(`Servidor rodando na porta ${process.env.PORT}`)
    );
  })
  .catch(err => console.error(err));
