import express from 'express';
import morgan from 'morgan';
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import orderRoutes from './routes/order.routes';
import productRoutes from './routes/product.routes'
import roleRoutes from './routes/role.routes';
import connectDB from './config/db';


const app = express();
const PORT = process.env.PORT || 3015;

app.use(express.json());
app.use(morgan('dev'));

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/products', productRoutes);
app.use('/api/roles', roleRoutes);

//Funcion anonima, que no se nombra
connectDB().then(() =>{
    app.listen(PORT, () => {
        console.log(`Server is running on ${PORT}`);
        }
    );
})


