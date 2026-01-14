# 📱 UI Xem và Chia sẻ Mã Phòng

## ✨ Tính năng mới

Tôi đã thêm **UI hiển thị mã phòng** với các tính năng sau:

### 1. **Hiển thị Mã Phòng Nổi bật**
- Mỗi room card giờ có một **section riêng** để hiển thị mã phòng
- Background gradient (primary → secondary)
- Font chữ `mono` để dễ đọc
- Text có thể select để copy thủ công

### 2. **Nút Copy Mã Phòng** 
- Icon: `Copy` → `Check` (khi đã copy)
- Màu xanh lá khi copy thành công (2 giây)
- Tự động copy vào clipboard
- Tooltip: "Copy mã phòng"

### 3. **Nút QR Code**
- Icon: `QrCode`
- Màu vàng (secondary color)
- Mở modal hiển thị QR code
- Tooltip: "Hiển thị QR Code"

### 4. **QR Code Modal**
- Hiển thị mã phòng lớn
- Placeholder cho QR code (có thể tích hợp thư viện QR thật)
- Nút "COPY MÃ PHÒNG" trong modal
- Đóng modal bằng nút X hoặc click outside

---

## 🎨 Giao diện

### Room Card - Section Mã Phòng:
```
┌─────────────────────────────────────────┐
│  Mã Truy cập Học phần                   │
│  ┌───────────────────────────────────┐  │
│  │  MLN131-TEST-01          [📋] [QR]│  │
│  │  Chia sẻ mã này với học viên      │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

### QR Code Modal:
```
┌──────────────────────────────┐
│  Mã QR Truy cập         [X]  │
│  MLN131-TEST-01              │
│                              │
│  ┌────────────────────────┐  │
│  │                        │  │
│  │      [QR Code Icon]    │  │
│  │   Quét mã để tham gia  │  │
│  │    MLN131-TEST-01      │  │
│  │                        │  │
│  └────────────────────────┘  │
│                              │
│  Học viên có thể quét mã QR  │
│  hoặc nhập mã phòng để tham  │
│  gia                         │
│                              │
│  [📋 COPY MÃ PHÒNG]          │
└──────────────────────────────┘
```

---

## 🧪 Cách test

### Test Copy Mã Phòng:
1. Mở Admin Dashboard
2. Tạo một phòng mới (ví dụ: `MLN131-DEMO`)
3. Tìm phòng trong danh sách
4. Bấm nút **Copy** (icon 📋)
5. **Kết quả mong đợi**:
   - Nút chuyển sang màu xanh lá
   - Icon đổi thành ✓ (Check)
   - Mã phòng đã được copy vào clipboard
   - Sau 2 giây, nút trở về trạng thái ban đầu
6. Paste vào notepad/editor để kiểm tra

### Test QR Code Modal:
1. Bấm nút **QR Code** (icon QR màu vàng)
2. **Kết quả mong đợi**:
   - Modal hiển thị
   - Mã phòng hiển thị lớn ở trên
   - QR code placeholder hiển thị ở giữa
   - Nút "COPY MÃ PHÒNG" ở dưới
3. Bấm nút "COPY MÃ PHÒNG" trong modal
4. **Kết quả**: Mã được copy vào clipboard
5. Đóng modal bằng:
   - Nút X (góc trên phải)
   - Click ra ngoài modal

---

## 🔧 Tích hợp QR Code thật (Optional)

Nếu bạn muốn hiển thị QR code thật thay vì placeholder, cài đặt thư viện:

```bash
npm install qrcode.react
```

Sau đó import và sử dụng trong modal:

```tsx
import QRCode from 'qrcode.react';

// Trong QR Code Modal, thay thế placeholder bằng:
<QRCode 
    value={`http://localhost:5173/?room=${selectedRoomForQR.room_code}`}
    size={256}
    level="H"
    includeMargin={true}
/>
```

---

## ✅ Checklist

- [x] Hiển thị mã phòng nổi bật trong room card
- [x] Nút copy với feedback (màu xanh + icon check)
- [x] Clipboard API hoạt động
- [x] Nút QR code mở modal
- [x] QR modal hiển thị đúng thông tin
- [x] Copy trong modal hoạt động
- [x] Đóng modal bằng X hoặc click outside
- [x] Responsive design
- [x] Animation mượt mà

---

## 🎯 Use Cases

### UC1: Giảng viên chia sẻ mã phòng qua chat
1. Tạo phòng
2. Copy mã phòng
3. Paste vào Zalo/Messenger/Email
4. Học viên nhập mã để tham gia

### UC2: Giảng viên chiếu QR code lên màn hình
1. Tạo phòng
2. Bấm nút QR Code
3. Chiếu modal lên projector
4. Học viên quét QR để tham gia (khi tích hợp QR thật)

### UC3: Admin kiểm tra lại mã phòng
1. Vào tab "Học phần Khảo thí"
2. Xem danh sách phòng
3. Mã phòng hiển thị rõ ràng trong section riêng

---

## 🚀 Hoàn thành!

UI xem và chia sẻ mã phòng đã sẵn sàng! Giảng viên giờ có thể dễ dàng chia sẻ mã phòng với học viên. 🎉
