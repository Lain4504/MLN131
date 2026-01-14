# 📋 Hướng dẫn Test Full Flow - MLN131 Quiz Battle

## 🎯 Mục tiêu
Test toàn bộ luồng từ lúc Admin tạo phòng → Người chơi tham gia → Thi đấu → Kết thúc và xem kết quả.

---

## 🛠️ Bước 1: Chuẩn bị môi trường

### 1.1. Kiểm tra Supabase
1. Truy cập **Supabase Dashboard** của bạn
2. Vào **SQL Editor**
3. Chạy toàn bộ nội dung file `supabase_schema.sql`
4. Kiểm tra các bảng đã được tạo:
   - `rooms`
   - `players`
   - `questions`
   - `answers`
   - `items_used`

### 1.2. Kiểm tra Environment Variables
Mở file `.env` và đảm bảo có đủ:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_ADMIN_PASSWORD=admin123
```

### 1.3. Khởi động ứng dụng
```bash
npm install
npm run dev
```

Ứng dụng sẽ chạy tại: `http://localhost:5173`

---

## 👨‍💼 Bước 2: Vai trò Admin (Tab 1)

### 2.1. Truy cập Admin Dashboard
1. Mở trình duyệt Chrome
2. Truy cập: `http://localhost:5173/#admin`
3. Bạn sẽ thấy giao diện **Admin Dashboard**

### 2.2. Tạo phòng mới
1. Bấm nút **"KHỞI TẠO HỌC PHẦN"** (màu đỏ, góc trên bên phải)
2. Trong modal xuất hiện:
   - Nhập **Mã phòng**: `MLN131-TEST` (hoặc bất kỳ mã nào bạn muốn)
   - Bấm **"KÍCH HOẠT PHIÊN ĐẤU"**
3. Modal sẽ đóng lại
4. Phòng mới sẽ xuất hiện trong danh sách với:
   - Trạng thái: **"Chế độ chờ"** (màu xám)
   - Mã phòng: `MLN131-TEST`
   - Câu hỏi hiện tại: `#1`

> **Lưu ý**: Lúc này phòng đã được tạo trên Supabase với `status = 'waiting'`

---

## 🧑‍🎓 Bước 3: Vai trò Người chơi (Tab 2)

### 3.1. Mở tab mới (Incognito hoặc trình duyệt khác)
1. Nhấn `Ctrl + Shift + N` (Chrome Incognito) hoặc mở Firefox/Edge
2. Truy cập: `http://localhost:5173/`

### 3.2. Tham gia phòng
1. Bạn sẽ thấy màn hình **Entry Screen**
2. Nhập thông tin:
   - **Tên**: `Đồng chí Học viên` (hoặc tên bất kỳ)
   - **Mã phòng**: `MLN131-TEST` (phải khớp với mã Admin vừa tạo)
3. Bấm **"KHỞI TẠO PHIÊN ĐẤU"**
4. Bạn sẽ thấy màn hình chờ với thông báo:
   > **"Đang chờ chủ phòng bắt đầu..."**

> **Kiểm tra Realtime**: Nếu bạn mở **Supabase Table Editor** → bảng `players`, bạn sẽ thấy người chơi mới được thêm vào.

---

## ⚔️ Bước 4: Bắt đầu trận đấu

### 4.1. Quay lại Tab Admin (Tab 1)
1. Tìm phòng `MLN131-TEST` trong danh sách
2. Bấm nút **"KÍCH HOẠT HỌC PHẦN"**
3. Trạng thái phòng sẽ chuyển sang **"Đang vận hành"** (màu đỏ)

### 4.2. Quan sát Tab Người chơi (Tab 2)
1. Màn hình chờ sẽ **tự động chuyển** sang **QuizScreen**
2. Bạn sẽ thấy:
   - Câu hỏi đầu tiên
   - 4 đáp án (A, B, C, D)
   - Thanh thời gian đếm ngược (30 giây)
   - Sidebar bảng xếp hạng
   - Kho vật phẩm ở dưới

---

## 🎮 Bước 5: Chơi game

### 5.1. Trả lời câu hỏi
1. Chọn một đáp án (A, B, C, hoặc D)
2. Đáp án sẽ được highlight màu đỏ
3. Điểm số sẽ được tính dựa trên:
   - **Đúng/Sai**: 1000 điểm nếu đúng, 0 điểm nếu sai
   - **Time Bonus**: `(30 - timeUsed) * 10` điểm
4. Điểm sẽ được cập nhật lên Supabase và hiển thị ngay lập tức

### 5.2. Kiểm tra Realtime Updates
1. Mở thêm **Tab 3** (người chơi thứ 2):
   - Tên: `Đồng chí Nghiên cứu sinh`
   - Mã phòng: `MLN131-TEST`
2. Cả 2 người chơi sẽ thấy:
   - Bảng xếp hạng cập nhật theo thời gian thực
   - Thứ hạng thay đổi khi có người trả lời đúng

### 5.3. Thử nghiệm vật phẩm (Optional)
1. Bấm vào một vật phẩm màu vàng (Buff):
   - Ví dụ: **"Gia tăng"** → Thông báo xuất hiện ở góc phải
2. Bấm vào vật phẩm màu đỏ (Debuff):
   - Ví dụ: **"Gây nhiễu"** → Overlay chọn đối thủ xuất hiện
   - Chọn một người chơi → Thông báo xác nhận

---

## 📊 Bước 6: Giám sát từ Admin

### 6.1. Chuyển sang tab "Giám sát Trực tuyến"
1. Quay lại **Tab Admin** (Tab 1)
2. Bấm vào tab **"Giám sát Trực tuyến"** ở sidebar
3. Chọn phòng `MLN131-TEST` từ dropdown
4. Bạn sẽ thấy:
   - Danh sách người chơi theo thứ hạng
   - Điểm số realtime
   - Thống kê: Tổng thí sinh, Câu hiện tại, Hiệu suất trung bình

### 6.2. Điều khiển trận đấu
1. Bấm **"TIẾN TỚI LUẬN ĐIỂM TIẾP THEO"**:
   - Câu hỏi sẽ chuyển sang câu tiếp theo
   - Tất cả người chơi sẽ thấy câu hỏi mới
2. Bấm **"ĐÌNH CHỈ GIAO THỨC (KẾT THÚC)"**:
   - Trạng thái phòng chuyển sang `finished`
   - Người chơi sẽ thấy màn hình kết quả

---

## 🏆 Bước 7: Xem kết quả

### 7.1. Màn hình Leaderboard (Người chơi)
1. Sau khi Admin kết thúc phòng
2. Người chơi sẽ thấy **LeaderboardScreen** với:
   - Top 3 người chơi (huy chương vàng, bạc, đồng)
   - Danh sách đầy đủ tất cả người chơi
   - Điểm số và thứ hạng

### 7.2. Kiểm tra dữ liệu trên Supabase
1. Mở **Supabase Table Editor**
2. Kiểm tra bảng `answers`:
   - Mỗi câu trả lời đã được ghi lại
   - Có thông tin: `player_id`, `question_id`, `is_correct`, `time_used`, `points_awarded`
3. Kiểm tra bảng `players`:
   - Điểm số cuối cùng của mỗi người chơi

---

## ✅ Checklist kiểm tra

- [ ] Admin tạo phòng thành công
- [ ] Người chơi join phòng thành công
- [ ] Màn hình chờ hiển thị đúng
- [ ] Admin start game → Người chơi tự động chuyển màn hình
- [ ] Câu hỏi hiển thị đúng nội dung
- [ ] Thanh thời gian đếm ngược
- [ ] Chọn đáp án → Điểm được cập nhật
- [ ] Bảng xếp hạng cập nhật realtime
- [ ] Admin giám sát thấy danh sách người chơi
- [ ] Admin advance question → Câu hỏi thay đổi
- [ ] Admin end game → Hiển thị màn hình kết quả
- [ ] Dữ liệu được lưu đúng trên Supabase

---

## 🐛 Troubleshooting

### Lỗi: "Không tìm thấy phòng chơi này"
- **Nguyên nhân**: Mã phòng không khớp hoặc chưa được tạo
- **Giải pháp**: Kiểm tra lại mã phòng, đảm bảo Admin đã tạo phòng trước

### Lỗi: "Phòng này đã bắt đầu hoặc đã kết thúc"
- **Nguyên nhân**: Phòng đã chuyển sang trạng thái `playing` hoặc `finished`
- **Giải pháp**: Tạo phòng mới hoặc reset trạng thái phòng về `waiting` trong Supabase

### Realtime không hoạt động
- **Nguyên nhân**: Supabase Realtime chưa được bật
- **Giải pháp**: 
  1. Vào **Supabase Dashboard** → **Database** → **Replication**
  2. Bật Realtime cho các bảng: `rooms`, `players`, `items_used`

### Câu hỏi không hiển thị
- **Nguyên nhân**: Chưa có dữ liệu trong bảng `questions`
- **Giải pháp**: Chạy lại phần seed data trong `supabase_schema.sql`

---

## 🎉 Kết luận

Bạn đã test thành công toàn bộ luồng! Nếu tất cả các bước trên hoạt động, ứng dụng đã sẵn sàng để demo hoặc triển khai.

**Chúc mừng! 🚀**
