# 🎒 Item Inventory System - Hệ thống Kho Vật phẩm

## ✅ Đã triển khai

Hệ thống inventory với logic:
- **Ban đầu**: 0 items cho tất cả loại
- **Trả lời đúng**: Random nhận 1 item bất kỳ
- **Hiển thị**: Badge số lượng trên mỗi item
- **Giới hạn**: Chỉ dùng được khi có item
- **Consume**: Trừ 1 khi dùng

---

## 📊 Database Schema

### Bảng `players` - Thêm cột `item_inventory`:
```sql
item_inventory JSONB DEFAULT '{
    "score_boost":0,
    "time_extend":0,
    "shield":0,
    "confusion":0,
    "time_attack":0
}'::jsonb
```

---

## 🔄 Flow hoạt động

### 1. Trả lời đúng → Nhận item random
```typescript
// gameService.submitAnswer()
if (isCorrect) {
    const itemTypes = ['score_boost', 'time_extend', 'shield', 'confusion', 'time_attack'];
    const rewardedItem = itemTypes[Math.floor(Math.random() * itemTypes.length)];
    
    newInventory[rewardedItem] = (newInventory[rewardedItem] || 0) + 1;
}

return { 
    newScore, 
    newInventory,
    rewardedItem // Để hiển thị notification
};
```

### 2. Hiển thị reward notification
```tsx
// QuizScreen.tsx
useEffect(() => {
    if (lastRewardedItem) {
        setShowRewardNotification(true);
        setTimeout(() => setShowRewardNotification(false), 3000);
    }
}, [lastRewardedItem]);
```

### 3. Kiểm tra inventory trước khi dùng
```tsx
const handleItemClick = async (label, type, color) => {
    const itemCount = itemInventory[type] || 0;
    if (itemCount <= 0) {
        alert(`Bạn không còn ${label}!`);
        return;
    }
    
    // Consume item
    await gameService.consumeItem(currentPlayer.id, type);
    
    // Use item
    await gameService.useItem(...);
};
```

### 4. Consume item (Trừ số lượng)
```typescript
// gameService.consumeItem()
const currentCount = inventory[itemType] || 0;

if (currentCount <= 0) {
    throw new Error(`Không còn ${itemType} trong kho`);
}

const newInventory = {
    ...inventory,
    [itemType]: currentCount - 1
};

// Update DB
await supabase
    .from('players')
    .update({ item_inventory: newInventory })
    .eq('id', playerId);
```

---

## 🎨 UI Components

### ItemButton với Badge
```tsx
<ItemButton 
    icon={<Sparkles size={16} />} 
    label="Gia tăng" 
    color="yellow" 
    count={itemInventory.score_boost}  // Hiển thị số lượng
    onClick={() => handleItemClick(...)} 
/>
```

**Features**:
- Badge hiển thị số lượng (góc trên phải)
- Disabled khi count = 0 (opacity 40%, grayscale, cursor-not-allowed)
- Màu badge: Yellow items → Secondary, Red items → Primary

### Reward Notification
```tsx
<AnimatePresence>
    {showRewardNotification && lastRewardedItem && (
        <motion.div className="fixed bottom-20 left-1/2 -translate-x-1/2 bg-gradient-to-r from-secondary to-primary">
            <Sparkles /> +1 {lastRewardedItem.replace('_', ' ')}
        </motion.div>
    )}
</AnimatePresence>
```

**Animation**:
- Scale from 0.8 → 1
- Y from 50 → 0
- Auto hide sau 3 giây
- Bounce animation cho icon

---

## 🧪 Test Flow

### Scenario 1: Nhận item khi trả lời đúng
1. Player 1 trả lời đúng câu hỏi
2. **Kết quả**:
   - Điểm tăng
   - Notification hiển thị: "+1 time_extend" (random)
   - Badge trên item button hiển thị số 1
   - Item button không còn disabled

### Scenario 2: Dùng item khi có trong kho
1. Player 1 có 2 time_extend
2. Click "Hãn chế"
3. **Kết quả**:
   - Thời gian +5 giây
   - Badge giảm từ 2 → 1
   - Item được lưu vào `items_used` table

### Scenario 3: Không thể dùng khi hết item
1. Player 1 có 0 confusion
2. Click "Gây nhiễu"
3. **Kết quả**:
   - Alert: "Bạn không còn Gây nhiễu!"
   - Không mở targeting overlay
   - Không trừ item (vì đã check trước)

### Scenario 4: Item được consume trước khi use
1. Player 1 có 1 time_attack
2. Click "Công kích" → Chọn Player 2
3. **Kết quả**:
   - Badge giảm từ 1 → 0 ngay lập tức
   - Item được gửi đến Player 2
   - Nếu network error → Item vẫn bị trừ (cần rollback logic nếu muốn)

---

## 📈 GameState Updates

```typescript
interface GameState {
    // ... existing fields
    itemInventory: Record<string, number>;
    lastRewardedItem: string | null;
}

// Initial state
itemInventory: {
    score_boost: 0,
    time_extend: 0,
    shield: 0,
    confusion: 0,
    time_attack: 0
}
```

---

## 🔧 API Methods

### gameService.submitAnswer()
**Returns**:
```typescript
{
    newScore: number;
    newInventory: Record<string, number>;
    rewardedItem: string | null;
}
```

### gameService.getPlayerInventory(playerId)
**Returns**: `Record<string, number>`

### gameService.consumeItem(playerId, itemType)
**Returns**: `Record<string, number>` (new inventory)
**Throws**: Error if item count <= 0

---

## 🎯 Probability & Balance

### Item Drop Rate
- **Hiện tại**: 100% drop khi trả lời đúng
- **Random**: Mỗi loại có xác suất 20% (1/5)

### Có thể điều chỉnh:
```typescript
// Weighted random
const itemPool = [
    'time_extend', 'time_extend', 'time_extend',  // 3/8 = 37.5%
    'shield', 'shield',                            // 2/8 = 25%
    'confusion',                                   // 1/8 = 12.5%
    'time_attack',                                 // 1/8 = 12.5%
    'score_boost'                                  // 1/8 = 12.5%
];
const rewardedItem = itemPool[Math.floor(Math.random() * itemPool.length)];
```

---

## ✅ Checklist

- [x] Database schema (item_inventory column)
- [x] Random item reward on correct answer
- [x] Inventory display with badges
- [x] Consume item before use
- [x] Disable buttons when count = 0
- [x] Reward notification animation
- [x] Error handling for insufficient items
- [x] GameState integration
- [ ] Rollback on network error (TODO)
- [ ] Item drop probability tuning (TODO)
- [ ] Max inventory limit (TODO)

---

## 🚀 Next Steps (Optional)

### 1. Rollback on Error
```typescript
try {
    const oldInventory = await gameService.consumeItem(playerId, type);
    await gameService.useItem(...);
} catch (err) {
    // Rollback: restore old inventory
    await supabase.from('players').update({ item_inventory: oldInventory });
}
```

### 2. Max Inventory Limit
```typescript
if (newInventory[rewardedItem] >= 5) {
    // Don't reward, or convert to points
    return { newScore: newScore + 50, newInventory, rewardedItem: null };
}
```

### 3. Item Rarity System
```typescript
const rarityWeights = {
    common: ['time_extend', 'shield'],      // 60%
    uncommon: ['confusion', 'time_attack'], // 30%
    rare: ['score_boost']                   // 10%
};
```

---

## 🎉 Hoàn thành!

Hệ thống inventory giờ hoạt động đầy đủ:
- ✅ Bắt đầu với 0 items
- ✅ Nhận random item khi trả lời đúng
- ✅ Hiển thị số lượng
- ✅ Giới hạn sử dụng
- ✅ Notification đẹp mắt

**Người chơi giờ phải suy nghĩ chiến thuật khi dùng item!** 🎮
