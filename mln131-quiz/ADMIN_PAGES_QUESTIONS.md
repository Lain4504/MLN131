# 🎯 Admin Pages & Question Management

## ✅ Đã triển khai

### 1. **Question Management Page** (`/admin/questions`)
- Full CRUD: Create, Read, Update, Delete
- Modal form cho create/edit
- List tất cả câu hỏi
- Không chia chương, một list duy nhất

### 2. **Room Management Page** (`/admin/rooms/:roomId`)
- URL với roomId → Reload không mất state
- Realtime player list
- Start/End game controls
- Player scores và rankings

### 3. **Updated Routes**
- `/admin` - Dashboard
- `/admin/questions` - Quản lý câu hỏi
- `/admin/rooms/:roomId` - Quản lý room cụ thể

---

## 📁 Cấu trúc File Mới

```
src/
├── pages/
│   ├── admin/
│   │   ├── QuestionManagement.tsx  # CRUD câu hỏi
│   │   └── RoomManagement.tsx      # Quản lý room
│   └── AdminDashboard.tsx          # Dashboard chính
├── routes/
│   └── index.tsx                   # Routes config
└── lib/
    └── gameService.ts              # Added CRUD methods
```

---

## 🎓 Question Management

### Features:
- ✅ **Create**: Thêm câu hỏi mới
- ✅ **Read**: Hiển thị tất cả câu hỏi
- ✅ **Update**: Sửa câu hỏi
- ✅ **Delete**: Xóa câu hỏi (với confirm)

### Form Fields:
```typescript
{
    question: string;           // Câu hỏi
    options: string[];          // 4 đáp án
    correct_index: number;      // Index đáp án đúng (0-3)
    difficulty: 'Dễ' | 'Bình thường' | 'Khó';
}
```

### UI:
- List câu hỏi với số thứ tự
- Highlight đáp án đúng (border primary)
- Badge độ khó (màu khác nhau)
- Edit/Delete buttons
- Modal form responsive

---

## 🏠 Room Management

### Features:
- ✅ **URL Persistence**: `/admin/rooms/:roomId`
- ✅ **Realtime Players**: Auto-update khi có người join
- ✅ **Game Controls**: Start/End game
- ✅ **Player Rankings**: Sort by score

### Data Displayed:
- Room code
- Status (waiting/playing/finished)
- Player list với rankings
- Scores realtime

### Actions:
- **Bắt đầu**: Start game (waiting → playing)
- **Kết thúc**: End game (playing → finished)
- **Refresh**: Reload data
- **Quay lại**: Back to dashboard

---

## 🔧 GameService Updates

### New Methods:

#### Create Question:
```typescript
await gameService.createQuestion({
    content: {
        question: "...",
        options: ["A", "B", "C", "D"],
        correct_index: 0,
        difficulty: "Bình thường"
    }
});
```

#### Update Question:
```typescript
await gameService.updateQuestion(questionId, {
    content: { /* updated data */ }
});
```

#### Delete Question:
```typescript
await gameService.deleteQuestion(questionId);
```

---

## 🧪 Test Scenarios

### Test 1: Create Question
**Steps**:
1. Navigate to `/admin/questions`
2. Click "Thêm Câu Hỏi"
3. Fill form:
   - Question: "Ai là người sáng lập chủ nghĩa Mác?"
   - Options: A, B, C, D
   - Select correct answer (radio)
   - Difficulty: "Bình thường"
4. Click "Tạo mới"
5. **Expected**: Question appears in list

### Test 2: Edit Question
**Steps**:
1. Click Edit button on a question
2. Modify fields
3. Click "Cập nhật"
4. **Expected**: Changes saved and reflected

### Test 3: Delete Question
**Steps**:
1. Click Delete button
2. Confirm dialog
3. **Expected**: Question removed from list

### Test 4: Room Management
**Steps**:
1. In Dashboard, click "Quản lý" on a room
2. Navigate to `/admin/rooms/:roomId`
3. Refresh page (F5)
4. **Expected**: Still on same room, data persists

### Test 5: Start Game
**Steps**:
1. In Room Management
2. Click "Bắt đầu"
3. **Expected**: Status changes to "playing"

---

## 🎨 UI Features

### Question List:
- Numbered cards (1, 2, 3...)
- Question text
- 4 options in grid (2x2)
- Correct answer highlighted
- Difficulty badge with colors:
  - Dễ: Green
  - Bình thường: Yellow
  - Khó: Red

### Modal Form:
- Large textarea for question
- 4 input fields for options
- Radio buttons to select correct answer
- Dropdown for difficulty
- Save/Cancel buttons

### Room Management:
- Player cards with rankings
- Medal colors for top 3:
  - 1st: Primary (gold)
  - 2nd: Secondary (yellow)
  - 3rd: Accent blue
- Realtime score updates

---

## 📊 Database Schema

### Questions Table:
```sql
CREATE TABLE questions (
    id UUID PRIMARY KEY,
    content JSONB NOT NULL,
    created_at TIMESTAMP
);
```

### Content Structure:
```json
{
    "question": "...",
    "options": ["A", "B", "C", "D"],
    "correct_index": 0,
    "difficulty": "Bình thường"
}
```

---

## 🚀 Navigation Flow

### From Dashboard:
```
Dashboard → Click "Kho Dữ liệu Lý luận"
         → Navigate to /admin/questions

Dashboard → Click "Quản lý" on room
         → Navigate to /admin/rooms/:roomId
```

### Breadcrumbs:
```
/admin → Dashboard
/admin/questions → Question Management
/admin/rooms/:id → Room Management
```

---

## 🔄 TODO: Update Create Room

### Current (Mock):
```tsx
<select>
    <option>Kinh tế Chính trị Mác-Lênin (25 câu)</option>
    <option>Chủ nghĩa Duy vật Biện chứng (15 câu)</option>
</select>
```

### Planned (Real Data):
```tsx
// Auto-load all questions from DB
const questions = await gameService.getQuestions();

// Create room with all questions
await gameService.createRoom(roomCode, questions);
```

### Implementation:
1. Remove mock dropdown
2. Auto-assign all questions to new room
3. Show question count: "Sẽ sử dụng {count} câu hỏi"

---

## ✅ Checklist

- [x] QuestionManagement page
- [x] RoomManagement page
- [x] CRUD methods in gameService
- [x] Routes configuration
- [x] URL persistence
- [x] Realtime updates
- [x] UI/UX polish
- [ ] Update Create Room (TODO)
- [ ] Question import/export (Future)

---

## 🎉 Ready to Use!

### Access Pages:
```
http://localhost:5173/admin/questions
http://localhost:5173/admin/rooms/[room-id]
```

### Workflow:
1. **Manage Questions**: Add/Edit/Delete
2. **Create Room**: Auto-use all questions
3. **Manage Room**: Monitor players, control game
4. **Reload Safe**: URL keeps state

**Admin giờ có đầy đủ công cụ quản lý!** 🎯✨
