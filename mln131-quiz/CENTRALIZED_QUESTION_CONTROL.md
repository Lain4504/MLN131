# 🎮 Centralized Question Control

## ✅ Đã triển khai

### Admin Controls Question Flow:
- Admin click "Câu tiếp theo" → Tất cả players chuyển câu cùng lúc
- Không phải hiển thị đáp án cho admin
- Chỉ control index, players tự load câu hỏi

---

## 🔧 Implementation

### 1. **Database Schema**
```sql
ALTER TABLE rooms 
ADD COLUMN current_question_index INT DEFAULT 0;
```

**Purpose**: Lưu index câu hỏi hiện tại của room

---

### 2. **GameService Method**
```typescript
async advanceQuestion(roomId: string, nextIndex: number) {
    await supabase
        .from('rooms')
        .update({ current_question_index: nextIndex })
        .eq('id', roomId);
}
```

**Purpose**: Admin update index → Trigger realtime sync

---

### 3. **Admin Control (RoomManagement)**

#### UI:
```
┌─────────────────────────────────────────┐
│ Câu 5 / 25                              │
│ Điều khiển câu hỏi cho toàn bộ phòng    │
│                                         │
│ [#5] Ai là người sáng lập...  [Dễ]     │
│                                         │
│                    [Câu tiếp theo →]   │
└─────────────────────────────────────────┘
```

#### Logic:
```typescript
const handleNextQuestion = async () => {
    const currentIndex = room.current_question_index || 0;
    
    if (currentIndex < questions.length - 1) {
        await gameService.advanceQuestion(roomId, currentIndex + 1);
        // All players will sync via subscription
    }
};
```

---

### 4. **Player Sync (QuizScreen)** - TODO

#### Subscribe to Room Updates:
```typescript
useEffect(() => {
    if (!currentRoom?.id) return;

    const channel = gameService.subscribeToRoomUpdates(
        currentRoom.id, 
        (updatedRoom) => {
            // Sync question index
            setCurrentQuestionIndex(updatedRoom.current_question_index);
        }
    );

    return () => channel.unsubscribe();
}, [currentRoom?.id]);
```

#### Reset Timer on Question Change:
```typescript
useEffect(() => {
    // Reset timer when question changes
    setTimeLeft(30);
    setSelectedOption(null);
}, [currentQuestionIndex]);
```

---

## 🔄 Flow Diagram

```
Admin Dashboard
    ↓
Click "Câu tiếp theo"
    ↓
gameService.advanceQuestion(roomId, nextIndex)
    ↓
Supabase: UPDATE rooms SET current_question_index = nextIndex
    ↓
Realtime Broadcast
    ↓
All Players Subscribe
    ↓
Players: setCurrentQuestionIndex(nextIndex)
    ↓
QuizScreen re-renders with new question
    ↓
Timer resets, options clear
```

---

## 🧪 Test Scenarios

### Test 1: Admin Advances Question
**Setup**:
- 3 players in room
- Currently on question 1

**Steps**:
1. Admin: Click "Câu tiếp theo"
2. **Expected**:
   - Admin sees: "Câu 2 / 25"
   - Player 1: New question appears
   - Player 2: New question appears
   - Player 3: New question appears
   - All timers reset to 30s

### Test 2: Auto-Advance on Timer End
**Setup**:
- All players answered
- Timer = 0

**Steps**:
1. Timer reaches 0
2. **Expected**:
   - Admin can manually advance
   - OR auto-advance after 3s (optional)

### Test 3: Late Joiner
**Setup**:
- Room on question 5
- New player joins

**Steps**:
1. Player joins room
2. **Expected**:
   - Player sees question 5 (current)
   - Not question 1

---

## 📊 Database Migration

### Run in Supabase SQL Editor:
```sql
-- Add column
ALTER TABLE rooms 
ADD COLUMN IF NOT EXISTS current_question_index INT DEFAULT 0;

-- Update existing rooms
UPDATE rooms 
SET current_question_index = 0 
WHERE current_question_index IS NULL;

-- Verify
SELECT id, room_code, current_question_index 
FROM rooms;
```

---

## 🎯 Admin UI Features

### Question Control Card:
- ✅ **Current question number**: "Câu 5 / 25"
- ✅ **Question preview**: First line of question
- ✅ **Difficulty badge**: Dễ/Bình thường/Khó
- ✅ **Next button**: Disabled at last question
- ✅ **Warning note**: "Tất cả người chơi sẽ chuyển câu"

### NOT Showing:
- ❌ All 4 options
- ❌ Correct answer highlight
- ❌ Previous button (only forward)

---

## 🚀 Benefits

### Before (Old):
- ❌ Each player controls own question
- ❌ Players out of sync
- ❌ Hard to manage

### After (New):
- ✅ Centralized control
- ✅ All players synced
- ✅ Admin controls pace
- ✅ Better game flow

---

## 📝 TODO

### QuizScreen Updates Needed:
1. Subscribe to room updates
2. Sync currentQuestionIndex from room
3. Reset timer on question change
4. Clear selected option on change
5. Handle late joiners

### Optional Enhancements:
1. Auto-advance after timer ends
2. Show "Waiting for next question..." screen
3. Question transition animation
4. Admin can skip to specific question

---

## ✅ Summary

### What Changed:
- **Database**: Added `current_question_index` to rooms
- **Admin**: Control button to advance questions
- **Players**: Will sync via realtime (TODO)
- **Flow**: Centralized question control

### Result:
- 🎮 **Better control** for admin
- 🔄 **Synchronized** gameplay
- 📊 **Easier management**
- ✨ **Professional** game flow

**Admin giờ điều khiển câu hỏi cho toàn bộ phòng!** 🎯✨
