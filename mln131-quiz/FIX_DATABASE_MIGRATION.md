# 🔧 Fix Database Migration - Add item_inventory Column

## ❌ Lỗi hiện tại:
```
column players.item_inventory does not exist
```

## ✅ Giải pháp: Chạy Migration

### Bước 1: Mở Supabase Dashboard
1. Vào https://supabase.com/dashboard
2. Chọn project của bạn
3. Vào **SQL Editor** (menu bên trái)

### Bước 2: Chạy Migration SQL
Copy toàn bộ code dưới đây và paste vào SQL Editor:

```sql
-- Migration: Add item_inventory to players table

-- 1. Add item_inventory column
ALTER TABLE players 
ADD COLUMN IF NOT EXISTS item_inventory JSONB 
DEFAULT '{"score_boost":0,"time_extend":0,"shield":0,"confusion":0,"time_attack":0}'::jsonb;

-- 2. Update existing players (nếu có)
UPDATE players 
SET item_inventory = '{"score_boost":0,"time_extend":0,"shield":0,"confusion":0,"time_attack":0}'::jsonb
WHERE item_inventory IS NULL;

-- 3. Verify
SELECT column_name, data_type, column_default 
FROM information_schema.columns 
WHERE table_name = 'players' AND column_name = 'item_inventory';
```

### Bước 3: Click "Run" (hoặc Ctrl+Enter)

### Bước 4: Kiểm tra kết quả
Bạn sẽ thấy output:
```
column_name      | data_type | column_default
-----------------|-----------|----------------
item_inventory   | jsonb     | '{"score_boost":0,...}'::jsonb
```

---

## 🧪 Test lại

1. Refresh trang web (F5)
2. Join room và trả lời câu hỏi
3. **Kết quả mong đợi**:
   - Không còn lỗi 400
   - Trả lời đúng → Nhận item
   - Badge hiển thị số lượng

---

## 🔍 Debug (Nếu vẫn lỗi)

### Check xem column đã tồn tại chưa:
```sql
SELECT * FROM players LIMIT 1;
```

Kết quả phải có cột `item_inventory` với giá trị:
```json
{
  "score_boost": 0,
  "time_extend": 0,
  "shield": 0,
  "confusion": 0,
  "time_attack": 0
}
```

### Check existing players:
```sql
SELECT id, name, item_inventory FROM players;
```

Nếu có players cũ với `item_inventory = null`, chạy:
```sql
UPDATE players 
SET item_inventory = '{"score_boost":0,"time_extend":0,"shield":0,"confusion":0,"time_attack":0}'::jsonb
WHERE item_inventory IS NULL;
```

---

## 📝 Lưu ý

- Migration này **KHÔNG XÓA** dữ liệu cũ
- Chỉ **THÊM** cột mới
- Players cũ sẽ có inventory = 0 cho tất cả items
- Players mới tự động có inventory = 0

---

## ✅ Hoàn thành!

Sau khi chạy migration, hệ thống inventory sẽ hoạt động bình thường! 🎉
