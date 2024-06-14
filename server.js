import express from 'express';
import { handler } from './dist/server/entry.mjs'; // Ruta de tu archivo de entrada de Astro
import rateLimit from 'express-rate-limit';

const app = express();

// Configurar el rate limit
const limiter = rateLimit({
  message: 'Error', // Mensaje de error cuando se excede el límite
  statusCode: 429, // Código de estado HTTP para cuando se excede el límite
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // Límite de 100 solicitudes por IP
  standardHeaders: false, // Devolver información de rate limit en las cabeceras `RateLimit-*`
  legacyHeaders: false, // Desactivar las cabeceras `X-RateLimit-*`
});

const corsOptions = {
  origin: function (origin, callback) {
    // Lista blanca de dominios permitidos
    const whitelist = ['http://example1.com', 'http://example2.com'];
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true, // Permitir cookies
  optionsSuccessStatus: 204, // Para navegadores que soportan 204
};

app.use(cors(corsOptions));

// Aplicar el middleware de rate limit a todas las rutas
app.use(limiter);

// Manejar las solicitudes con el servidor de Astro
app.use(handler);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});
