# 🎮 Item System - Hệ thống Vật phẩm Realtime

## ✅ Đã implement

Tôi đã hoàn thiện **hệ thống vật phẩm thực tế** với các tính năng:

### 1. **Item Types (Loại vật phẩm)**

#### Buffs (Tự dùng - Màu vàng):
- **`score_boost`** - Gia tăng điểm (chưa implement effect, chỉ có UI)
- **`time_extend`** - Kéo dài thời gian (+5 giây)
- **`shield`** - Miễn dịch (xóa tất cả debuffs)

#### Debuffs (Dùng lên đối thủ - Màu đỏ):
- **`confusion`** - Gây nhiễu (chưa implement effect, chỉ có UI)
- **`time_attack`** - Công kích thời gian (-5 giây)

---

## 🔄 Flow hoạt động

### A. Người chơi dùng BUFF (màu vàng):
```
1. Click vật phẩm → handleItemClick('label', 'type', 'yellow')
2. Gọi gameService.useItem(playerId, playerId, type, questionIndex)
3. Lưu vào DB (bảng items_used)
4. Apply effect ngay lập tức:
   - time_extend: +5 giây
   - shield: Xóa debuffs
5. Hiển thị notification 2 giây
```

### B. Người chơi dùng DEBUFF (màu đỏ):
```
1. Click vật phẩm → Mở overlay chọn đối thủ
2. Click vào đối thủ → confirmTarget(targetId, targetName)
3. Gọi gameService.useItem(playerId, targetId, type, questionIndex)
4. Lưu vào DB với target_player_id
5. Realtime subscription → Đối thủ nhận thông báo
6. Đối thủ bị apply debuff:
   - time_attack: -5 giây
   - confusion: Thêm vào activeDebuffs
```

---

## 📊 Database Schema

Bảng `items_used`:
```sql
- id: UUID
- user_id: UUID (người dùng)
- target_player_id: UUID (người bị target, NULL nếu buff)
- item_type: TEXT (score_boost, time_extend, shield, confusion, time_attack)
- question_index: INT
- created_at: TIMESTAMP
```

---

## 🔌 Realtime Subscription

### Subscribe trong QuizScreen:
```tsx
useEffect(() => {
    if (!currentPlayer?.id) return;

    const channel = gameService.subscribeToItems(currentPlayer.id, (item) => {
        // Nhận item từ đối thủ
        console.log('Received item:', item);
        
        // Show notification
        setActiveItem({ 
            label: `${item.item_type} từ đối thủ!`, 
            color: 'red',
            type: item.item_type
        });

        // Apply debuff
        if (item.item_type === 'time_attack') {
            setTimeLeft(prev => Math.max(0, prev - 5));
        }
    });

    return () => channel.unsubscribe();
}, [currentPlayer?.id]);
```

---

## 🧪 Cách test

### Test 1: Buff (Tự dùng)
1. Mở 2 tab: Tab A (Player 1), Tab B (Player 2)
2. Tab A: Click "Hãn chế" (time_extend)
3. **Kết quả Tab A**:
   - Thời gian tăng lên +5 giây
   - Notification hiển thị 2 giây
   - Dữ liệu lưu vào DB

### Test 2: Debuff (Công kích đối thủ)
1. Mở 2 tab: Tab A (Player 1), Tab B (Player 2)
2. Tab A: Click "Công kích" (time_attack)
3. Overlay chọn đối thủ xuất hiện
4. Click vào Player 2
5. **Kết quả Tab B**:
   - Thời gian giảm -5 giây ngay lập tức
   - Notification đỏ hiển thị: "time_attack từ đối thủ!"
   - Dữ liệu lưu vào DB với target_player_id = Player 2

### Test 3: Shield (Xóa debuffs)
1. Player 1 dùng time_attack lên Player 2
2. Player 2 thấy debuff
3. Player 2 click "Miễn dịch" (shield)
4. **Kết quả**: Debuff bị xóa khỏi activeDebuffs

---

## 🐛 Debug

### Nếu item không hoạt động:

1. **Check console logs**:
   ```
   Received item: { item_type: 'time_attack', user_id: '...', ... }
   ```

2. **Check Supabase Realtime**:
   - Vào Dashboard → Database → Replication
   - Đảm bảo bảng `items_used` có Realtime enabled

3. **Check gameService.subscribeToItems**:
   ```tsx
   subscribeToItems(targetPlayerId: string, onInvite: (item: any) => void) {
       return supabase
           .channel(`items:${targetPlayerId}`)
           .on('postgres_changes', {
               event: 'INSERT',
               schema: 'public',
               table: 'items_used',
               filter: `target_player_id=eq.${targetPlayerId}`
           }, (payload) => {
               onInvite(payload.new);
           })
           .subscribe();
   }
   ```

4. **Check DB data**:
   ```sql
   SELECT * FROM items_used ORDER BY created_at DESC LIMIT 10;
   ```

---

## 🚀 Next Steps (Chưa implement)

### 1. Score Boost Effect
```tsx
if (type === 'score_boost') {
    // Nhân đôi điểm câu tiếp theo
    setScoreMultiplier(2);
}
```

### 2. Confusion Effect
```tsx
if (item.item_type === 'confusion') {
    // Shuffle đáp án hoặc ẩn 1 đáp án đúng
    setActiveDebuffs(prev => [...prev, 'confusion']);
}
```

### 3. Item Inventory (Giới hạn số lượng)
```tsx
const [itemInventory, setItemInventory] = useState({
    score_boost: 2,
    time_extend: 3,
    shield: 1,
    confusion: 2,
    time_attack: 3
});
```

### 4. Item Cooldown
```tsx
const [itemCooldowns, setItemCooldowns] = useState<Record<string, number>>({});

// Sau khi dùng item
setItemCooldowns(prev => ({ ...prev, [type]: Date.now() + 10000 }));
```

---

## ✅ Summary

- ✅ Database integration (items_used table)
- ✅ Realtime subscription (subscribeToItems)
- ✅ Buff effects (time_extend, shield)
- ✅ Debuff effects (time_attack)
- ✅ UI notifications
- ✅ Targeting overlay
- ⏳ Score boost effect (TODO)
- ⏳ Confusion effect (TODO)
- ⏳ Item inventory system (TODO)
- ⏳ Cooldown system (TODO)

**Hệ thống item giờ đã hoạt động realtime giữa các người chơi!** 🎉
