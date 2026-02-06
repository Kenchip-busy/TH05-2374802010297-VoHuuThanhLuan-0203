const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');

const app = express();

// ==========================================
// 1. CẤU HÌNH SERVER (CONFIGURATION)
// ==========================================

// Cấu hình thư mục Public (chứa file CSS, ảnh tĩnh)
app.use(express.static(path.join(__dirname, 'public')));

// Cấu hình Body Parser (để đọc JSON từ Postman và Form từ Web)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Cấu hình View Engine (EJS)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Cấu hình Session (Lưu giỏ hàng)
app.use(session({
    secret: 'secret-key-software-engineering-2026', // Khóa bí mật
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 * 60 * 24 } // Session sống 24h
}));

// ==========================================
// 2. KẾT NỐI DATABASE (MONGODB ATLAS)
// ==========================================
const dbURI = 'mongodb+srv://thanhluanvo310:1234567890@banhang.rtgmu4t.mongodb.net/quanlisanpham?retryWrites=true&w=majority&appName=banhang';

mongoose.connect(dbURI)
    .then(() => console.log('✅ Đã kết nối thành công tới MongoDB'))
    .catch((err) => console.log('❌ Lỗi kết nối MongoDB:', err));

// ==========================================
// 3. KHỞI TẠO MODELS (SCHEMA)
// ==========================================

// --- Model: Category (Danh mục) ---
const categorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    parent_category_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        default: null
    }
});
// Virtual field để lấy danh mục con (đệ quy)
categorySchema.virtual('children', {
    ref: 'Category',
    localField: '_id',
    foreignField: 'parent_category_id'
});
categorySchema.set('toObject', { virtuals: true });
categorySchema.set('toJSON', { virtuals: true });

const Category = mongoose.model('Category', categorySchema);

// --- Model: Product (Sản phẩm) ---
const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    categories_id: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],
    images: [{ type: String }],
    show: { type: Boolean, default: true }
});

const Product = mongoose.model('Product', productSchema);

// ==========================================
// 4. API ROUTES (DÀNH CHO POSTMAN)
// Lưu ý: Đã xóa tiền tố '/api' để khớp với ảnh bạn gửi
// ==========================================

// --- APIs PRODUCTS ---

// 1. Lấy danh sách sản phẩm (GET /products)
app.get('/products', async (req, res) => {
    try {
        const products = await Product.find().populate('categories_id', 'name');
        res.send(products);
    } catch (error) { res.status(500).send(error); }
});

// 2. Tạo sản phẩm mới (POST /products)
app.post('/products', async (req, res) => {
    try {
        const product = new Product(req.body);
        await product.save();
        res.status(201).send(product);
    } catch (error) { res.status(400).send(error); }
});

// 3. Sửa sản phẩm (PUT /products/:id)
app.put('/products/:id', async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!product) return res.status(404).send({ message: 'Product not found' });
        res.send(product);
    } catch (error) { res.status(400).send(error); }
});

// 4. Xóa sản phẩm (DELETE /products/:id)
app.delete('/products/:id', async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) return res.status(404).send({ message: 'Product not found' });
        res.send({ message: 'Đã xóa sản phẩm', product });
    } catch (error) { res.status(500).send(error); }
});

// 5. Tìm kiếm theo tên (GET /products/search/name?name=...)
app.get('/products/search/name', async (req, res) => {
    try {
        const nameQuery = req.query.name;
        const products = await Product.find({ name: { $regex: nameQuery, $options: 'i' } });
        res.send(products);
    } catch (error) { res.status(500).send(error); }
});

// --- APIs CATEGORIES ---

// 6. Lấy danh sách Category (GET /categories)
app.get('/categories', async (req, res) => {
    try {
        const categories = await Category.find().populate('children');
        res.send(categories);
    } catch (error) { res.status(500).send(error); }
});

// 7. Thêm Category (POST /categories)
app.post('/categories', async (req, res) => {
    try {
        const category = new Category(req.body);
        await category.save();
        res.status(201).send(category);
    } catch (error) { res.status(400).send(error); }
});

// 8. Sửa Category (PUT /categories/:id) -> Fix lỗi bạn gặp
app.put('/categories/:id', async (req, res) => {
    try {
        const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!category) return res.status(404).send({ message: 'Category not found' });
        res.send(category);
    } catch (error) { res.status(400).send(error); }
});

// 9. Xóa Category (DELETE /categories/:id)
app.delete('/categories/:id', async (req, res) => {
    try {
        // Kiểm tra ràng buộc dữ liệu trước khi xóa
        const categoryId = req.params.id;
        const hasSub = await Category.exists({ parent_category_id: categoryId });
        const hasProd = await Product.exists({ categories_id: categoryId });

        if (hasSub || hasProd) {
            return res.status(400).send({ message: 'Không thể xóa: Category đang chứa dữ liệu con.' });
        }
        await Category.findByIdAndDelete(categoryId);
        res.send({ message: 'Đã xóa Category thành công' });
    } catch (error) { res.status(500).send(error); }
});

// ==========================================
// 5. WEB ROUTES (DÀNH CHO TRÌNH DUYỆT / VIEW ENGINE)
// ==========================================

// Trang chủ: Hiển thị danh sách sản phẩm
app.get('/', async (req, res) => {
    try {
        const products = await Product.find();
        const cartCount = req.session.cart ? req.session.cart.length : 0;
        // Render file views/index.ejs
        res.render('index', { products, cartCount });
    } catch (error) {
        res.status(500).send("Lỗi Server Web: " + error.message);
    }
});

// Trang chi tiết sản phẩm
app.get('/product/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        const cartCount = req.session.cart ? req.session.cart.length : 0;
        if (!product) return res.redirect('/');
        res.render('detail', { product, cartCount });
    } catch (error) { res.status(500).send("Lỗi tìm sản phẩm"); }
});

// Logic thêm vào giỏ hàng (Session)
app.post('/cart/add/:id', async (req, res) => {
    const productId = req.params.id;
    if (!req.session.cart) req.session.cart = []; // Khởi tạo nếu chưa có
    try {
        const product = await Product.findById(productId);
        if (product) req.session.cart.push(product);
        res.redirect('/'); // Quay lại trang chủ
    } catch (error) { res.status(500).send("Lỗi thêm giỏ hàng"); }
});

// Trang xem Giỏ hàng
app.get('/cart', (req, res) => {
    const cart = req.session.cart || [];
    const cartCount = cart.length;
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    res.render('cart', { cart, cartCount, total });
});

// ==========================================
// 6. KHỞI CHẠY SERVER
// ==========================================
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`-----------------------------------------------`);
    console.log(`🚀 Server đang chạy tại: http://localhost:${PORT}`);
    console.log(`📦 API Products: http://localhost:${PORT}/products`);
    console.log(`📦 API Categories: http://localhost:${PORT}/categories`);
    console.log(`-----------------------------------------------`);
});