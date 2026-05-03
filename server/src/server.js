require('dotenv').config();
const mongoose = require('mongoose');
const app = require('./app');

const mongoDbUri = process.env.MONGODB_URI;

mongoose.connect(mongoDbUri, { autoIndex: true })
  .then(() => {
    if (mongoose.connection.readyState === 1) {
      console.log('MongoDB conectado');
    } else {
      console.log('MongoDB não conectado');
    }

    app.listen(1311, () => console.log('Servidor rodando'));
  })
  .catch(err => console.error('Erro ao conectar no MongoDB:', err));