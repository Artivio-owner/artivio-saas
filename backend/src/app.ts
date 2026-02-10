import { saasMiddleware } from './saas/saas.middleware';
import authRoutes from './auth/auth.routes';
import adminRoutes from './admin/admin.routes';
import productRoutes from './products/products.routes';
import orderRoutes from './orders/orders.routes';


app.use(saasMiddleware);
app.use('/auth', authRoutes);
app.use('/admin', adminRoutes);
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use(express.static('frontend/public'));