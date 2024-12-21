import { MongoClient } from 'mongodb';

const URI = process.env.MONGO_URI;
const options = {
  serverSelectionTimeoutMS: 60000, // Aumenta el timeout a 60 segundos
  socketTimeoutMS: 60000, // Añade un timeout para operaciones de socket
  useUnifiedTopology: true,
};

if (!URI) {
  throw new Error('Por favor, añade tu Mongo URI a .env.local')
}

let client;
let clientPromise;

if (process.env.NODE_ENV === 'development') {
  // En desarrollo, usamos una variable global para preservar la conexión entre recargas de HMR
  if (!global._mongoClientPromise) {
    client = new MongoClient(URI, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // En producción, es mejor no usar una variable global.
  client = new MongoClient(URI, options);
  clientPromise = client.connect();
}

// Manejo de errores global para la promesa de conexión
clientPromise.catch(error => {
  console.error('Error al conectar a MongoDB:', error);
  process.exit(1);
});

export default clientPromise;




/*import { MongoClient } from 'mongodb'

const URI = process.env.MONGO_URI
const options = {}

if (!URI) throw new Error('Please add your Mongo URI to .env.local')

let client = new MongoClient(URI, options)
let clientPromise

if (process.env.NODE_ENV !== 'production') {
  if (!global._mongoClientPromise) {
    global._mongoClientPromise = client.connect()
  }

  clientPromise = global._mongoClientPromise
} else {
  clientPromise = client.connect()
}

export default clientPromise*/
