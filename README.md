# Portfolio Thiết Kế Nội Thất

Trang web quảng bá các thiết kế nội thất với giao diện hiện đại và tinh tế.

## Tính Năng

- ✨ Giao diện hiện đại, responsive trên mọi thiết bị
- 🎨 Màu sắc tinh tế phù hợp với thiết kế nội thất
- 📸 Gallery hiển thị hình ảnh trước và sau khi thiết kế
- 💼 Modal chi tiết với thông tin đầy đủ về từng dự án
- 📱 Tối ưu cho mobile và tablet

## Cấu Trúc Dự Án

```
Thiet_ke_noi_that/
│
├── index.html          # Trang chủ
├── styles.css          # File CSS chính
├── script.js           # File JavaScript
├── data.js             # Dữ liệu các dự án
└── README.md           # File này
```

## Chạy Trang Web Trên Máy Tính

### Cách 1: Mở Trực Tiếp (Đơn Giản Nhất)

1. Mở File Explorer và điều hướng đến thư mục `Thiet_ke_noi_that`
2. Double-click vào file `index.html`
3. Trang web sẽ mở trong trình duyệt mặc định của bạn

**Lưu ý:** Một số tính năng có thể không hoạt động đầy đủ khi mở trực tiếp do chính sách CORS của trình duyệt.

### Cách 2: Sử Dụng Local Server (Khuyến Nghị)

#### Phương Pháp A: Sử Dụng Python (Nếu đã cài Python)

1. Mở **PowerShell** hoặc **Command Prompt**
2. Điều hướng đến thư mục dự án:
   ```powershell
   cd D:\Build-WEB\Thiet_ke_noi_that
   ```
3. Chạy lệnh sau:
   ```powershell
   # Python 3
   python -m http.server 8000
   
   # Hoặc nếu python không hoạt động, thử:
   py -m http.server 8000
   ```
4. Mở trình duyệt và truy cập: `http://localhost:8000`

#### Phương Pháp B: Sử Dụng Node.js (Nếu đã cài Node.js)

1. Cài đặt `http-server` (chỉ cần làm 1 lần):
   ```powershell
   npm install -g http-server
   ```
2. Mở PowerShell trong thư mục dự án:
   ```powershell
   cd D:\Build-WEB\Thiet_ke_noi_that
   ```
3. Chạy server:
   ```powershell
   http-server
   ```
4. Mở trình duyệt và truy cập địa chỉ hiển thị (thường là `http://localhost:8080`)

#### Phương Pháp C: Sử Dụng Live Server Extension (VS Code)

1. Cài đặt **VS Code** (nếu chưa có)
2. Cài đặt extension **Live Server** trong VS Code
3. Mở thư mục dự án trong VS Code
4. Click chuột phải vào file `index.html`
5. Chọn **Open with Live Server**

### Cách 3: Sử Dụng File Batch (Tự Động)

Tôi sẽ tạo file batch để bạn chỉ cần double-click là chạy được (xem phần dưới).

## Cách Sử Dụng

### 1. Chỉnh Sửa Dữ Liệu Dự Án

Mở file `data.js` và chỉnh sửa mảng `projects` để thêm/sửa/xóa các dự án của bạn:

```javascript
{
    id: 1,
    title: "Tên dự án",
    style: "Phong cách",
    beforeImage: "URL hình ảnh trước",
    afterImage: "URL hình ảnh sau",
    description: "Mô tả dự án",
    costItems: [
        "Hạng mục 1",
        "Hạng mục 2",
        // ...
    ],
    totalCost: "Giá tiền"
}
```

### 2. Thêm Hình Ảnh

Bạn có thể:
- Sử dụng URL từ các dịch vụ lưu trữ ảnh (Imgur, Cloudinary, etc.)
- Tạo thư mục `images/` và thêm hình ảnh vào đó, sau đó sử dụng đường dẫn tương đối
- Sử dụng GitHub để lưu trữ hình ảnh

### 3. Tùy Chỉnh Màu Sắc

Mở file `styles.css` và chỉnh sửa các biến CSS trong phần `:root`:

```css
:root {
    --primary-color: #D4C4B0;      /* Màu chính */
    --secondary-color: #8B7355;    /* Màu phụ */
    --accent-color: #C9A96B;       /* Màu nhấn */
    /* ... */
}
```

## Deploy trên GitHub Pages

### Bước 1: Tạo Repository trên GitHub

1. Đăng nhập vào GitHub
2. Tạo repository mới (ví dụ: `thiet-ke-noi-that`)
3. Upload tất cả các file lên repository

### Bước 2: Kích Hoạt GitHub Pages

1. Vào **Settings** của repository
2. Cuộn xuống phần **Pages**
3. Trong **Source**, chọn branch `main` (hoặc `master`)
4. Chọn folder `/ (root)`
5. Click **Save**

### Bước 3: Truy Cập Website

Sau vài phút, website của bạn sẽ có địa chỉ:
```
https://[username].github.io/[repository-name]
```

Ví dụ: `https://yourusername.github.io/thiet-ke-noi-that`

## Tùy Chỉnh

### Thay Đổi Thông Tin Liên Hệ

Mở file `index.html` và tìm phần **Contact Section** để chỉnh sửa thông tin liên hệ.

### Thay Đổi Nội Dung Giới Thiệu

Mở file `index.html` và tìm phần **About Section** để chỉnh sửa nội dung.

### Thêm Section Mới

Bạn có thể thêm các section mới vào `index.html` và style chúng trong `styles.css`.

## Lưu Ý

- Đảm bảo tất cả hình ảnh có kích thước phù hợp (khuyến nghị: 800x600px hoặc lớn hơn)
- Tối ưu hóa hình ảnh trước khi upload để tăng tốc độ tải trang
- Kiểm tra website trên nhiều trình duyệt khác nhau
- Test trên mobile để đảm bảo responsive hoạt động tốt

## Hỗ Trợ

Nếu bạn gặp vấn đề, hãy kiểm tra:
- Console của trình duyệt (F12) để xem lỗi JavaScript
- Đảm bảo tất cả file đã được upload đúng
- Kiểm tra đường dẫn hình ảnh có đúng không

## License

Dự án này được tạo cho mục đích quảng bá thiết kế nội thất.

