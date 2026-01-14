# 🎯 Quick Test: Tạo Room từ Admin Dashboard

## Các bước test nhanh tính năng tạo phòng:

### 1️⃣ Khởi động ứng dụng
```bash
npm run dev
```

### 2️⃣ Truy cập Admin Dashboard
- Mở trình duyệt: `http://localhost:5173/#admin`
- Bạn sẽ thấy giao diện Admin với sidebar bên trái

### 3️⃣ Tạo phòng mới
1. **Bấm nút "KHỞI TẠO HỌC PHẦN"** (màu đỏ, góc trên phải)
2. **Modal xuất hiện** với form:
   - Nhập mã phòng: `MLN131-TEST-01`
   - (Các field khác là demo, chỉ có room_code được lưu)
3. **Bấm "KÍCH HOẠT PHIÊN ĐẤU"**
4. **Kết quả mong đợi**:
   - Modal đóng lại
   - Alert hiển thị: ✅ Phòng "MLN131-TEST-01" đã được tạo thành công!
   - Phòng mới xuất hiện ngay lập tức trong danh sách
   - Trạng thái: "Chế độ chờ" (màu xám)

### 4️⃣ Test các trường hợp lỗi

#### Test 1: Mã phòng trống
- Bấm "KHỞI TẠO HỌC PHẦN"
- Để trống mã phòng
- Bấm submit
- **Kết quả**: Alert "Vui lòng nhập mã phòng!"

#### Test 2: Mã phòng trùng
- Tạo phòng với mã: `MLN131-DUPLICATE`
- Tạo lại phòng với cùng mã: `MLN131-DUPLICATE`
- **Kết quả**: Alert "❌ Mã phòng này đã tồn tại. Vui lòng chọn mã khác."

### 5️⃣ Kiểm tra trong Supabase
1. Mở **Supabase Dashboard**
2. Vào **Table Editor** → bảng `rooms`
3. Bạn sẽ thấy các phòng vừa tạo với:
   - `id`: UUID tự động
   - `room_code`: Mã bạn vừa nhập
   - `status`: `waiting`
   - `current_question_index`: `0`
   - `created_at`: Timestamp hiện tại

### 6️⃣ Test Realtime (Optional)
1. Mở **2 tab Admin Dashboard** song song
2. Tạo phòng ở Tab 1
3. **Kết quả**: Tab 2 sẽ tự động hiển thị phòng mới (nhờ Realtime subscription)

---

## ✅ Checklist

- [ ] Nút "KHỞI TẠO HỌC PHẦN" hoạt động
- [ ] Modal hiển thị đúng
- [ ] Nhập mã phòng và submit thành công
- [ ] Alert thành công hiển thị
- [ ] Phòng mới xuất hiện trong danh sách
- [ ] Loading state hoạt động (nút disable khi đang tạo)
- [ ] Validate mã phòng trống
- [ ] Validate mã phòng trùng
- [ ] Dữ liệu lưu đúng trong Supabase
- [ ] Realtime sync giữa các tab

---

## 🐛 Nếu gặp lỗi

### Lỗi: "Cannot read properties of undefined"
- **Nguyên nhân**: `gameService.createRoom` chưa được import
- **Giải pháp**: Đã được fix, reload lại trang

### Lỗi: Network error
- **Nguyên nhân**: Supabase credentials sai hoặc chưa cấu hình
- **Giải pháp**: Kiểm tra file `.env`:
  ```env
  VITE_SUPABASE_URL=https://your-project.supabase.co
  VITE_SUPABASE_ANON_KEY=your-anon-key
  ```

### Phòng không xuất hiện
- **Nguyên nhân**: Realtime chưa được bật
- **Giải pháp**: 
  1. Vào Supabase Dashboard → Database → Replication
  2. Bật Realtime cho bảng `rooms`

---

## 🎉 Hoàn thành!

Nếu tất cả các bước trên hoạt động, tính năng tạo phòng đã sẵn sàng! 🚀
