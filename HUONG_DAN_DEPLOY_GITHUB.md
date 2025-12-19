# Hướng Dẫn Deploy Lên GitHub Pages - Chi Tiết Từng Bước

## 📋 Bước 1: Tạo Repository và Upload Files

1. Đăng nhập vào GitHub
2. Click nút **"New"** hoặc **"+"** → **"New repository"**
3. Đặt tên repository (ví dụ: `Noi_that_DaLat`)
4. Chọn **Public** (hoặc Private nếu có GitHub Pro)
5. **KHÔNG** tích vào "Add a README file" (vì bạn đã có sẵn)
6. Click **"Create repository"**

### Upload Files lên GitHub:

**Cách A: Dùng GitHub Web Interface**
1. Trong repository mới tạo, click **"uploading an existing file"**
2. Kéo thả tất cả các file vào:
   - `index.html`
   - `styles.css`
   - `script.js`
   - `data.js`
   - `README.md`
   - `.nojekyll`
3. Scroll xuống, nhập commit message: "Initial commit"
4. Click **"Commit changes"**

**Cách B: Dùng Git Command Line** (Nếu đã cài Git)
```bash
cd D:\Build-WEB\Thiet_ke_noi_that
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/[username]/[repository-name].git
git push -u origin main
```

---

## 🚀 Bước 2: Kích Hoạt GitHub Pages

### Bạn đang ở đây! 👇

1. **Trong repository của bạn**, click vào tab **"Settings"** (ở thanh menu trên)

2. **Scroll xuống** phần **"Pages"** (ở sidebar bên trái, dưới mục "Code and automation")

3. **Trong phần "Build and deployment":**
   - **Source:** Click dropdown **"Deploy from a branch"**
   - **Branch:** 
     - Click dropdown hiện đang hiển thị **"None"**
     - Chọn branch **"main"** (hoặc **"master"** nếu repository của bạn dùng master)
     - Ở dropdown bên cạnh, chọn **"/ (root)"** (thư mục gốc)
   - Click nút **"Save"** (sẽ sáng lên sau khi bạn chọn branch)

4. **Đợi vài giây**, bạn sẽ thấy thông báo màu xanh:
   ```
   ✓ Your site is live at https://[username].github.io/[repository-name]/
   ```

---

## ✅ Bước 3: Kiểm Tra Website

1. Click vào link màu xanh hiển thị ở trên
2. Hoặc truy cập: `https://[username].github.io/[repository-name]`
3. Website của bạn sẽ hiển thị!

**Lưu ý:** Có thể mất 1-2 phút để GitHub build và publish website lần đầu.

---

## 🔧 Xử Lý Sự Cố

### ❌ Vấn đề: Không thấy branch "main" trong dropdown

**Giải pháp:**
- Đảm bảo bạn đã commit và push code lên GitHub
- Kiểm tra xem branch của bạn tên là gì (có thể là "master" thay vì "main")
- Refresh trang Settings

### ❌ Vấn đề: Website hiển thị 404

**Giải pháp:**
- Đảm bảo file `index.html` nằm ở thư mục gốc (root) của repository
- Kiểm tra bạn đã chọn "/ (root)" trong dropdown
- Đợi thêm vài phút (GitHub cần thời gian build)

### ❌ Vấn đề: Website không load CSS/JS

**Giải pháp:**
- Kiểm tra đường dẫn file trong `index.html` phải đúng:
  ```html
  <link rel="stylesheet" href="styles.css">
  <script src="script.js"></script>
  <script src="data.js"></script>
  ```
- Đảm bảo tất cả file đã được upload lên GitHub
- Xóa cache trình duyệt (Ctrl + F5)

### ❌ Vấn đề: Hình ảnh không hiển thị

**Giải pháp:**
- Nếu dùng URL từ Unsplash/Imgur: Kiểm tra URL có đúng không
- Nếu dùng hình ảnh local: Upload hình vào thư mục `images/` và cập nhật đường dẫn trong `data.js`

---

## 📝 Checklist Trước Khi Deploy

- [ ] Tất cả file đã được upload lên GitHub
- [ ] File `index.html` nằm ở thư mục gốc
- [ ] Đã chọn branch đúng (main hoặc master)
- [ ] Đã chọn "/ (root)" trong dropdown
- [ ] Đã click "Save"
- [ ] Đã đợi vài phút để GitHub build

---

## 🎉 Sau Khi Deploy Thành Công

1. **Chia sẻ link:** Bạn có thể chia sẻ link website với khách hàng
2. **Cập nhật nội dung:** Mỗi khi sửa code, commit và push lên GitHub, website sẽ tự động cập nhật (có thể mất 1-2 phút)
3. **Tùy chỉnh domain:** Nếu có domain riêng, bạn có thể cấu hình trong phần "Custom domain" của GitHub Pages

---

## 💡 Mẹo Hữu Ích

- **Xem log build:** Vào tab **"Actions"** để xem quá trình build có lỗi không
- **Kiểm tra file:** Vào tab **"Code"** để đảm bảo tất cả file đã có
- **Test local trước:** Luôn test trên máy tính trước khi push lên GitHub

Chúc bạn deploy thành công! 🚀

