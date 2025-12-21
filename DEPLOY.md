# Hướng Dẫn Deploy Lên GitHub Pages

## 📋 Tổng Quan

Trang web này sử dụng hệ thống export/import để lưu trữ dữ liệu và hình ảnh. Khi deploy lên GitHub Pages, bạn cần export dữ liệu từ local và upload file `data.json` lên repository.

## 🚀 Các Bước Deploy

### Bước 1: Chuẩn Bị Dữ Liệu Trên Local

1. **Mở trang web local** (mở file `index.html` trong trình duyệt hoặc dùng local server)

2. **Đăng nhập vào Admin**:
   - Vào trang `login.html`
   - Username: `admin`
   - Password: `admin`

3. **Thêm/Sửa các dự án**:
   - Click "Thêm Dự Án Mới"
   - Upload hình ảnh trước và sau thiết kế
   - Điền đầy đủ thông tin
   - Lưu dự án

4. **Export dữ liệu**:
   - Trong trang Admin, click nút **"📥 Export Dữ Liệu"**
   - File JSON sẽ được tải về máy (tên file: `interior-design-data-YYYY-MM-DD.json`)
   - File này chứa tất cả dự án và hình ảnh (dạng base64)

5. **Đổi tên file**:
   - Đổi tên file vừa export thành `data.json`
   - Đặt file này vào thư mục gốc của project

### Bước 2: Tạo Repository Trên GitHub

1. Đăng nhập vào GitHub
2. Click nút "+" → "New repository"
3. Đặt tên repository (ví dụ: `interior-design-website`)
4. Chọn Public hoặc Private
5. **KHÔNG** tích "Initialize with README" (vì bạn đã có file)
6. Click "Create repository"

### Bước 3: Upload Files Lên GitHub

**Cách 1: Sử dụng GitHub Web Interface**

1. Vào repository vừa tạo
2. Click "uploading an existing file"
3. Kéo thả các file sau vào:
   - `index.html`
   - `detail.html`
   - `login.html`
   - `admin.html`
   - `style.css`
   - `script.js`
   - `data.json` (file đã export)
   - `README.md`
   - `.gitignore`
4. Click "Commit changes"

**Cách 2: Sử dụng Git Command Line**

```bash
# Khởi tạo git repository
git init

# Thêm tất cả files
git add .

# Commit
git commit -m "Initial commit: Interior Design Website"

# Thêm remote repository
git remote add origin https://github.com/<username>/<repository-name>.git

# Push lên GitHub
git branch -M main
git push -u origin main
```

### Bước 4: Bật GitHub Pages

1. Vào repository trên GitHub
2. Click **Settings** (ở menu trên cùng)
3. Scroll xuống phần **Pages** (ở sidebar bên trái)
4. Trong phần **Source**:
   - Chọn branch: `main`
   - Chọn folder: `/ (root)`
5. Click **Save**

### Bước 5: Truy Cập Website

Sau vài phút, website sẽ có sẵn tại:
```
https://<username>.github.io/<repository-name>/
```

Ví dụ: `https://johndoe.github.io/interior-design-website/`

## 🔄 Cập Nhật Dữ Liệu Sau Khi Deploy

Khi bạn muốn thêm/sửa/xóa dự án trên website đã deploy:

### Cách 1: Sử dụng Website (Khuyến nghị)

1. Mở website đã deploy
2. Đăng nhập vào Admin
3. Thêm/sửa/xóa dự án
4. Click **"📥 Export Dữ Liệu"** để tải file mới
5. Đổi tên file thành `data.json`
6. Vào GitHub repository → Upload file `data.json` mới (thay thế file cũ)
7. Commit changes

### Cách 2: Sử dụng Git

```bash
# Clone repository về máy
git clone https://github.com/<username>/<repository-name>.git
cd <repository-name>

# Mở website local và export dữ liệu mới
# Thay thế file data.json

# Commit và push
git add data.json
git commit -m "Update projects data"
git push
```

## 📝 Lưu Ý Quan Trọng

1. **File data.json**: 
   - Phải đặt ở thư mục gốc của repository
   - Phải có tên chính xác là `data.json`
   - Website sẽ tự động load file này khi khởi động

2. **Hình ảnh**:
   - Hình ảnh được lưu dạng base64 trong file `data.json`
   - Đã được tự động nén để giảm dung lượng
   - Không cần upload hình ảnh riêng lẻ

3. **LocalStorage**:
   - Dữ liệu cũng được lưu trong localStorage làm backup
   - Nhưng khi deploy, `data.json` sẽ được ưu tiên load trước

4. **Giới hạn GitHub Pages**:
   - Repository phải là Public (hoặc GitHub Pro với Private repo)
   - File `data.json` không nên quá 100MB (khuyến nghị < 10MB)

## 🐛 Xử Lý Lỗi

### Website không hiển thị dữ liệu

1. Kiểm tra Console (F12) xem có lỗi không
2. Kiểm tra file `data.json` có tồn tại không
3. Kiểm tra định dạng JSON có đúng không (có thể dùng JSON validator online)

### Hình ảnh không hiển thị

1. Kiểm tra trong `data.json` có key `images` không
2. Kiểm tra các project có reference đúng key hình ảnh không
3. Thử export lại dữ liệu từ local

### Không thể đăng nhập

1. Kiểm tra đúng username/password: `admin`/`admin`
2. Xóa cache trình duyệt và thử lại
3. Kiểm tra Console xem có lỗi JavaScript không

## 📞 Hỗ Trợ

Nếu gặp vấn đề, vui lòng:
1. Kiểm tra Console của trình duyệt (F12)
2. Kiểm tra Network tab để xem file `data.json` có load được không
3. Đảm bảo tất cả files đã được upload đúng

---

**Chúc bạn deploy thành công! 🎉**

