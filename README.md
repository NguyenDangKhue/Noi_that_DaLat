# Trang Web Thiết Kế Nội Thất

Trang web giới thiệu các dự án thiết kế nội thất với hiệu ứng reveal (before/after) chuyên nghiệp.

## Tính Năng

- ✨ Hiệu ứng reveal thanh dọc để so sánh hình ảnh trước và sau thiết kế
- 🖼️ Upload và nén hình ảnh tự động
- 📱 Responsive design, tương thích mobile
- 🔐 Trang quản trị để thêm/sửa/xóa dự án
- 💾 Export/Import dữ liệu để backup và deploy

## Cài Đặt

1. Clone repository:
```bash
git clone <your-repo-url>
cd Trang_tri_noi_that_2
```

2. Mở `index.html` trong trình duyệt hoặc sử dụng local server:
```bash
# Sử dụng Python
python -m http.server 8000

# Hoặc sử dụng Node.js
npx http-server
```

## Deploy Lên GitHub Pages

### Bước 1: Chuẩn bị dữ liệu

1. Mở trang web local và đăng nhập vào trang Admin (admin/admin)
2. Thêm/sửa các dự án và upload hình ảnh
3. Click nút **"📥 Export Dữ Liệu"** để tải file JSON về máy
4. File JSON sẽ chứa tất cả dự án và hình ảnh (dạng base64)

### Bước 2: Upload lên GitHub

1. Tạo repository mới trên GitHub
2. Upload các file HTML, CSS, JS vào repository
3. Upload file `data.json` đã export vào thư mục gốc
4. Vào Settings → Pages của repository
5. Chọn branch `main` và folder `/ (root)`
6. Click Save

### Bước 3: Truy cập website

Website sẽ có địa chỉ: `https://<username>.github.io/<repository-name>`

## Cập Nhật Dữ Liệu

Khi cần cập nhật dữ liệu sau khi đã deploy:

1. Mở website đã deploy
2. Đăng nhập vào trang Admin
3. Thêm/sửa/xóa dự án
4. Export dữ liệu mới
5. Upload file `data.json` mới lên GitHub (thay thế file cũ)
6. Commit và push lên GitHub

## Cấu Trúc File

```
Trang_tri_noi_that_2/
├── index.html          # Trang chủ
├── detail.html         # Trang chi tiết dự án
├── login.html          # Trang đăng nhập
├── admin.html          # Trang quản trị
├── style.css           # CSS styles
├── script.js           # JavaScript logic
├── data.json           # Dữ liệu dự án và hình ảnh (tự động load)
└── README.md           # Hướng dẫn này
```

## Lưu Ý

- **Hình ảnh**: Hình ảnh được tự động nén khi upload để giảm dung lượng
- **LocalStorage**: Dữ liệu cũng được lưu trong localStorage làm backup
- **data.json**: File này được ưu tiên load trước, sau đó mới đến localStorage
- **Giới hạn**: localStorage có giới hạn ~5-10MB, nên với nhiều hình ảnh nên sử dụng data.json

## Tài Khoản Admin

- Username: `admin`
- Password: `admin`

⚠️ **Lưu ý bảo mật**: Trong môi trường production, nên thay đổi mật khẩu và sử dụng authentication thực sự.

## Hỗ Trợ

Nếu gặp vấn đề, vui lòng kiểm tra:
1. Console của trình duyệt (F12) để xem lỗi
2. Đảm bảo file `data.json` tồn tại và đúng định dạng
3. Kiểm tra đường dẫn file trong GitHub Pages

## License

MIT License

