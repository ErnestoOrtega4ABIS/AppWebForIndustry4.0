import express from 'express';
import morgan from 'morgan';
import authRoutes from './routes/auth.routes';
import connectDB from './config/db';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(morgan('dev'));

app.use('/api/auth', authRoutes);

//Funcion anonima, que no se nombra
connectDB().then(() =>{
    app.listen(PORT, () => {
        console.log(`Server is running on ${PORT}`);
        }
    );
})


