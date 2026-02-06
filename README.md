# TH05-2374802010297-VoHuuThanhLuan-0203
#  Hệ Thống Quản Lý Sản Phẩm

> **Bài thực hành 05** - Môn Công Nghệ Phần Mềm  
> **MSSV:** 2374802010297  
> **Họ tên:** Võ Hữu Thanh Luân  
> **Lớp:** 0203

---

##  Giới Thiệu

Đây là ứng dụng web quản lý sản phẩm và danh mục, được xây dựng bằng **Node.js**, **Express.js** và **MongoDB Atlas**. Ứng dụng hỗ trợ cả **API RESTful** (test bằng Postman) và **giao diện web** (View Engine EJS).

---

##  Công Nghệ Sử Dụng

| Công nghệ | Mô tả |
|-----------|-------|
| **Node.js** | Môi trường chạy JavaScript phía server |
| **Express.js** | Framework web cho Node.js |
| **MongoDB Atlas** | Cơ sở dữ liệu NoSQL trên cloud |
| **Mongoose** | ODM để làm việc với MongoDB |
| **EJS** | Template engine để render giao diện |
| **Express-Session** | Quản lý session (giỏ hàng) |

---

##  Cấu Trúc Thư Mục

```
TH05-2374802010297-VoHuuThanhLuan-0203/
├── app.js              # File chính của ứng dụng
├── package.json        # Cấu hình dependencies
├── public/             # Chứa file tĩnh (CSS, ảnh)
└── views/              # Chứa các file giao diện EJS
    ├── index.ejs       # Trang chủ - Danh sách sản phẩm
    ├── detail.ejs      # Trang chi tiết sản phẩm
    └── cart.ejs        # Trang giỏ hàng
```

---

##  Hướng Dẫn Cài Đặt

### 1. Clone dự án
```bash
git clone https://github.com/Kenchip-busy/TH05-2374802010297-VoHuuThanhLuan-0203.git
cd TH05-2374802010297-VoHuuThanhLuan-0203
```

### 2. Cài đặt dependencies
```bash
npm install
```

### 3. Chạy ứng dụng
```bash
node app.js
```

### 4. Truy cập
- **Giao diện Web:** http://localhost:3000
- **API Products:** http://localhost:3000/products
- **API Categories:** http://localhost:3000/categories

---

##  API Endpoints

###  Products (Sản phẩm)

| Phương thức | Endpoint | Mô tả |
|-------------|----------|-------|
| `GET` | `/products` | Lấy danh sách tất cả sản phẩm |
| `POST` | `/products` | Tạo sản phẩm mới |
| `PUT` | `/products/:id` | Cập nhật sản phẩm theo ID |
| `DELETE` | `/products/:id` | Xóa sản phẩm theo ID |
| `GET` | `/products/search/name?name=...` | Tìm kiếm sản phẩm theo tên |

###  Categories (Danh mục)

| Phương thức | Endpoint | Mô tả |
|-------------|----------|-------|
| `GET` | `/categories` | Lấy danh sách tất cả danh mục |
| `POST` | `/categories` | Tạo danh mục mới |
| `PUT` | `/categories/:id` | Cập nhật danh mục theo ID |
| `DELETE` | `/categories/:id` | Xóa danh mục theo ID |

---

## Trang Web

| Đường dẫn | Mô tả |
|-----------|-------|
| `/` | Trang chủ - Hiển thị danh sách sản phẩm |
| `/product/:id` | Trang chi tiết sản phẩm |
| `/cart` | Trang giỏ hàng |
| `/cart/add/:id` | Thêm sản phẩm vào giỏ hàng |

---

##  Mô Hình Dữ Liệu (Schema)

### Product (Sản phẩm)
```javascript
{
    name: String,          // Tên sản phẩm (bắt buộc)
    description: String,   // Mô tả
    price: Number,         // Giá (bắt buộc)
    categories_id: Array,  // Mảng ID danh mục
    images: Array,         // Mảng đường dẫn ảnh
    show: Boolean          // Trạng thái hiển thị
}
```

### Category (Danh mục)
```javascript
{
    name: String,              // Tên danh mục (bắt buộc)
    parent_category_id: ObjectId  // ID danh mục cha (null nếu là gốc)
}
```

---

##  Ghi Chú

- Database được kết nối qua **MongoDB Atlas** (cloud)
- Giỏ hàng sử dụng **Session** (lưu trong 24 giờ)
- Có thể test API bằng **Postman**

---

**Võ Hữu Thanh Luân**   
🎓 MSSV: 2374802010297

---


