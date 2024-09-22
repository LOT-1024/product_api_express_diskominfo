import express from 'express';
import helmet from 'helmet';
import { corsMiddleware } from './middlewares/corsConfig';
import orderRoutes from './routes/orderRoutes';
import productRoutes from './routes/productRoutes';

const app = express();
const port = 9000;

app.use(express.json());
app.use(corsMiddleware);
app.use(helmet());

app.use('/api/orders', orderRoutes);
app.use('/api/products', productRoutes); 

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
