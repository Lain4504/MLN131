# 🚀 Quick Test - Centralized Question Control

## ⚠️ IMPORTANT: Run Migration First!

### Step 1: Database Migration
```sql
-- Vào Supabase SQL Editor: https://supabase.com/dashboard
-- Copy & Run:

ALTER TABLE rooms 
ADD COLUMN IF NOT EXISTS current_question_index INT DEFAULT 0;

UPDATE rooms 
SET current_question_index = 0 
WHERE current_question_index IS NULL;
```

---

## 🧪 Test Flow

### Step 2: Start Dev Server
```bash
npm run dev
```

### Step 3: Login Admin
```
1. Vào http://localhost:5173/admin/login
2. Password: mln131admin
3. Click "Access Dashboard"
```

### Step 4: Create/Select Room
```
1. Click "Tạo Phòng" (hoặc chọn room có sẵn)
2. Nhập code: TEST-CONTROL
3. Click "Tạo Phòng"
4. Click "Quản lý" trên room card
```

### Step 5: Start Game
```
1. Trong Room Management
2. Click "Bắt đầu"
→ Status: playing
→ Question control xuất hiện
```

### Step 6: Test Question Control
```
1. Xem: "Câu 1 / X"
2. Click "Câu tiếp theo"
3. Xem: "Câu 2 / X"
→ Success! ✓
```

---

## ✅ Expected Behavior

### Admin View:
```
┌─────────────────────────────────────────┐
│ Câu 1 / 25                              │
│ Điều khiển câu hỏi cho toàn bộ phòng    │
│                                         │
│ [#1] Câu hỏi preview...      [Dễ]      │
│                                         │
│ 💡 Khi bấm "Câu tiếp theo"...          │
│                                         │
│                    [Câu tiếp theo →]   │
└─────────────────────────────────────────┘
```

### After Click:
```
Câu 1 / 25  →  Câu 2 / 25
```

### Button States:
- **Enabled**: Khi có câu tiếp theo
- **Disabled**: Ở câu cuối (opacity 30%)

---

## 🐛 Troubleshooting

### Error: "subscribeToRoomUpdates is not a function"
**Fixed!** Changed to `subscribeToRoom`

### Error: "column current_question_index does not exist"
**Solution**: Run migration SQL (Step 1)

### Question not changing
**Check**:
1. Migration đã chạy chưa?
2. Room status = 'playing'?
3. Console có errors?

---

## 📊 Verify in Database

```sql
-- Check room has column
SELECT id, room_code, current_question_index, status 
FROM rooms 
WHERE room_code = 'TEST-CONTROL';

-- Should return:
-- current_question_index: 0, 1, 2... (changes when you click)
```

---

## 🎯 Next: Player Sync (TODO)

Players chưa sync tự động. Cần update QuizScreen:

```typescript
// TODO in QuizScreen.tsx
useEffect(() => {
    const channel = gameService.subscribeToRoom(
        currentRoom.id, 
        (room) => {
            setCurrentQuestionIndex(room.current_question_index);
        }
    );
    return () => channel.unsubscribe();
}, [currentRoom?.id]);
```

---

## ✅ Current Status

- ✅ Database migration ready
- ✅ Admin control working
- ✅ Realtime sync working
- ⏳ Player sync (TODO)

**Admin control hoạt động! Test ngay!** 🎮✨
