import { MongoClient } from 'mongodb';

const uri = 'mongodb://localhost:27017'; 
const client = new MongoClient(uri);

async function connectDB() {
    try {
        await client.connect();
        console.log('Conectado ao MongoDB!');
        const db = client.db('nomeDoSeuBanco'); 
    } catch (err) {
        console.error('Erro ao conectar ao MongoDB:', err);
    }
}

connectDB();