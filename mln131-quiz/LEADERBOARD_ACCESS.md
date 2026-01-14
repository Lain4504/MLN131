# 🏆 LeaderboardScreen - Access Flow

## 📍 Cách truy cập LeaderboardScreen

### Automatic (Tự động):
LeaderboardScreen **KHÔNG** có URL riêng. Nó được hiển thị tự động khi:

```
Game Status = 'finished'
```

---

## 🔄 Complete Game Flow

### URL Structure:
```
/room/:roomCode  → RoomPage (wrapper)
                 ↓
                 Renders based on status:
                 - waiting  → Waiting screen
                 - playing  → QuizScreen
                 - finished → LeaderboardScreen ✓
```

### Step-by-Step:

#### 1. **Join Room** (`status: idle`)
```
User: http://localhost:5173/
→ EntryScreen
→ Enter room code + name
→ Click "Tham gia"
→ Navigate to /room/MLN131-DEMO
```

#### 2. **Waiting** (`status: waiting`)
```
URL: /room/MLN131-DEMO
Status: waiting
Display: "Đang chờ chủ phòng bắt đầu..."
```

#### 3. **Playing** (`status: playing`)
```
URL: /room/MLN131-DEMO (same)
Status: playing
Display: QuizScreen (câu hỏi, timer, items)
```

#### 4. **Finished** (`status: finished`) ✓
```
URL: /room/MLN131-DEMO (same)
Status: finished
Display: LeaderboardScreen (rankings, scores)
```

---

## 🎮 How to Trigger Leaderboard

### Method 1: Admin Controls (Recommended)
```
1. Admin vào /admin/rooms/:roomId
2. Click "Bắt đầu" → status: playing
3. Players chơi game
4. Admin click "Kết thúc" → status: finished
5. All players see LeaderboardScreen automatically
```

### Method 2: Programmatic (Code)
```typescript
// In admin or game logic
await gameService.updateRoomStatus(roomId, 'finished');

// All players in room will see LeaderboardScreen
```

### Method 3: Dev Helper (Testing)
```
1. Vào /room/:code
2. Press "Finished" button in dev helper (bottom-left)
3. LeaderboardScreen appears
```

---

## 🧪 Test Scenarios

### Test 1: Complete Game Flow
**Steps**:
1. Create room in admin
2. Join as player
3. Admin starts game
4. Answer questions
5. Admin ends game
6. **Expected**: LeaderboardScreen shows with rankings

### Test 2: Direct Status Change
**Steps**:
1. Join room (waiting)
2. Click dev helper "Finished" button
3. **Expected**: LeaderboardScreen appears immediately

### Test 3: Multiple Players
**Steps**:
1. 3 players join room
2. Admin starts game
3. Players answer with different scores
4. Admin ends game
5. **Expected**: All 3 see leaderboard with correct rankings

---

## 📊 RoomPage Logic

```tsx
export const RoomPage: React.FC = () => {
    const { status } = useGameStore();

    switch (status) {
        case 'waiting':
            return <WaitingScreen />;
        
        case 'playing':
            return <QuizScreen />;
        
        case 'finished':
            return <LeaderboardScreen />; // ✓ Here!
        
        default:
            return <ErrorScreen />;
    }
};
```

**Key Point**: Same URL, different content based on `status`

---

## 🔧 Status Management

### Where Status is Stored:
```typescript
// useGameStore.ts
interface GameState {
    status: 'idle' | 'waiting' | 'playing' | 'finished';
    // ...
}
```

### How Status Changes:
```typescript
// 1. Join room
await joinRoom(roomCode, name);
→ status: 'waiting'

// 2. Admin starts
await updateRoomStatus(roomId, 'playing');
→ status: 'playing'

// 3. Admin ends
await updateRoomStatus(roomId, 'finished');
→ status: 'finished' → LeaderboardScreen shows
```

---

## 🎯 LeaderboardScreen Features

### What it Shows:
- ✅ Final rankings (1st, 2nd, 3rd with medals)
- ✅ Player scores
- ✅ "You" badge for current player
- ✅ "Chơi lại" button

### Data Source:
```typescript
// Fetches real data from database
const players = await gameService.getPlayers(roomId);
// Sorted by score descending
players.sort((a, b) => b.score - a.score);
```

### Realtime Updates:
```typescript
// Subscribes to player changes
gameService.subscribeToPlayers(roomId, (updatedPlayers) => {
    setPlayers(updatedPlayers.sort((a, b) => b.score - a.score));
});
```

---

## 🚀 Quick Access (For Testing)

### Option 1: Dev Helper
```
1. Vào bất kỳ /room/:code nào
2. Bottom-left corner → Click "Finished"
3. LeaderboardScreen appears
```

### Option 2: Console
```javascript
// In browser console
useGameStore.getState().setStatus('finished');
```

### Option 3: Admin Dashboard
```
1. /admin/rooms/:roomId
2. Click "Kết thúc"
3. All players see leaderboard
```

---

## 📝 Important Notes

### ⚠️ No Direct URL:
```
❌ /leaderboard          → Doesn't exist
❌ /room/:code/results   → Doesn't exist
✅ /room/:code           → Shows based on status
```

### ✅ State-Based Rendering:
- Same URL throughout game
- Content changes based on `status`
- Clean, simple routing

### 🔄 Realtime Sync:
- All players see same screen
- Status synced via Supabase
- Automatic updates

---

## 🎉 Summary

### Access LeaderboardScreen:
```
1. Join room → /room/:code
2. Wait for admin to start
3. Play game
4. Admin ends game
5. LeaderboardScreen shows automatically
```

### Key Points:
- ✅ **No separate URL**
- ✅ **Status-based rendering**
- ✅ **Automatic transition**
- ✅ **Realtime data**
- ✅ **All players synced**

**LeaderboardScreen là kết quả tự nhiên của game flow!** 🏆✨
