# Hướng Dẫn Chạy Trang Web Trên Máy Tính

## 🚀 Cách Nhanh Nhất

### Double-click vào file `start-server.bat`

File này sẽ tự động:
- Tìm Python hoặc Node.js trên máy bạn
- Khởi động server local
- Hiển thị địa chỉ để truy cập

Sau đó mở trình duyệt và truy cập địa chỉ hiển thị (thường là `http://localhost:8000` hoặc `http://localhost:8080`)

---

## 📋 Các Cách Khác

### Cách 1: Mở Trực Tiếp File HTML

1. Vào thư mục `Thiet_ke_noi_that`
2. Double-click vào `index.html`
3. Trang web sẽ mở trong trình duyệt

**⚠️ Lưu ý:** Một số tính năng có thể không hoạt động đầy đủ.

---

### Cách 2: Dùng Python (Nếu đã cài)

1. Mở **PowerShell** hoặc **Command Prompt**
2. Gõ lệnh:
   ```powershell
   cd D:\Build-WEB\Thiet_ke_noi_that
   python -m http.server 8000
   ```
   (Nếu không được, thử: `py -m http.server 8000`)
3. Mở trình duyệt: `http://localhost:8000`

**Cài Python:** https://www.python.org/downloads/

---

### Cách 3: Dùng Node.js (Nếu đã cài)

1. Cài `http-server` (chỉ 1 lần):
   ```powershell
   npm install -g http-server
   ```
2. Mở PowerShell trong thư mục dự án:
   ```powershell
   cd D:\Build-WEB\Thiet_ke_noi_that
   http-server
   ```
3. Mở trình duyệt: `http://localhost:8080`

**Cài Node.js:** https://nodejs.org/

---

### Cách 4: Dùng VS Code Live Server

1. Cài **VS Code**: https://code.visualstudio.com/
2. Cài extension **Live Server** trong VS Code
3. Mở thư mục dự án trong VS Code
4. Click phải vào `index.html` → **Open with Live Server**

---

## ❓ Câu Hỏi Thường Gặp

**Q: Tôi không có Python hay Node.js, làm sao?**  
A: Bạn có thể mở trực tiếp file `index.html` hoặc cài một trong hai phần mềm trên.

**Q: Làm sao để dừng server?**  
A: Nhấn `Ctrl + C` trong cửa sổ PowerShell/Command Prompt.

**Q: Tôi thấy lỗi CORS, làm sao?**  
A: Bạn cần chạy qua local server (dùng Python hoặc Node.js), không mở trực tiếp file HTML.

**Q: Làm sao để xem trên điện thoại?**  
A: Tìm địa chỉ IP của máy tính, sau đó truy cập `http://[IP-của-bạn]:8000` từ điện thoại (cùng mạng WiFi).

---

## ✅ Kiểm Tra

Sau khi chạy, bạn sẽ thấy:
- ✅ Trang chủ với hero section
- ✅ Portfolio gallery với 6 dự án mẫu
- ✅ Click vào dự án sẽ mở modal chi tiết
- ✅ Responsive trên mobile

Chúc bạn thành công! 🎉

