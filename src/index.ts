import mongoose from 'mongoose';
import { app } from './app';

const dbUser = process.env.DB_USER || '';
const dbPassword = process.env.DB_PASS || '';
const dbName = process.env.NODE_ENV === 'development' ? 'TinDin' : 'TinDinTeste';

mongoose
  .connect(`mongodb+srv://${dbUser}:${dbPassword}@cluster0.1bwnn.mongodb.net/${dbName}?retryWrites=true&w=majority`)
  .then(() => {
    const PORT = process.env.PORT || 3333;
    app.listen(PORT);
    console.log('Servidor iniciado na porta:', PORT);
    console.log('Banco conectado');
  })
  .catch((err) => {
    console.log(err);
  });
