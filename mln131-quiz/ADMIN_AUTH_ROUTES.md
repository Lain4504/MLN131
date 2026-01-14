# 🔐 Admin Authentication & Route Management

## ✅ Đã triển khai

### 1. **Admin Authentication System**
- Password protection cho Admin Dashboard
- Persistent login với localStorage
- Auto-redirect khi chưa đăng nhập

### 2. **Separated Routes**
- Routes tách riêng trong `/src/routes/`
- Dễ quản lý và mở rộng
- Protected routes cho admin

### 3. **New Pages**
- `AdminLogin`: Trang đăng nhập admin
- `RoomPage`: Wrapper cho game states

---

## 📁 Cấu trúc File

```
src/
├── routes/
│   └── index.tsx          # Route configuration
├── pages/
│   ├── AdminLogin.tsx     # Admin login page
│   ├── RoomPage.tsx       # Room wrapper
│   ├── AdminDashboard.tsx # Admin dashboard (protected)
│   ├── EntryScreen.tsx    # Home page
│   ├── QuizScreen.tsx     # Quiz game
│   └── LeaderboardScreen.tsx # Results
├── store/
│   ├── useGameStore.ts    # Game state
│   └── useAdminStore.ts   # Admin auth state
└── App.tsx                # Main app with BrowserRouter
```

---

## 🔐 Admin Authentication Flow

### Login Flow:
```
1. User navigates to /admin
2. Not authenticated → Redirect to /admin/login
3. Enter password: "mln131admin"
4. Click "Access Dashboard"
5. Password correct → Set isAuthenticated = true
6. Redirect to /admin
7. Show AdminDashboard
```

### Logout Flow:
```
1. Click "Đăng xuất" button in sidebar
2. Set isAuthenticated = false
3. Clear localStorage
4. Redirect to /admin/login
```

### Persistent Login:
```
1. Login successful → Save to localStorage
2. Refresh page → Read from localStorage
3. Still authenticated → Stay logged in
4. No need to login again
```

---

## 🛣️ Routes Configuration

### Public Routes:
```tsx
<Route path="/" element={<EntryScreen />} />
<Route path="/room/:roomCode" element={<RoomPage />} />
```

### Protected Admin Routes:
```tsx
<Route 
    path="/admin/login" 
    element={isAuthenticated ? <Navigate to="/admin" /> : <AdminLogin />} 
/>
<Route 
    path="/admin" 
    element={isAuthenticated ? <AdminDashboard /> : <Navigate to="/admin/login" />} 
/>
```

### Fallback:
```tsx
<Route path="*" element={<Navigate to="/" replace />} />
```

---

## 🔑 Admin Credentials

### Default Password:
```
mln131admin
```

### Change Password:
Edit `src/store/useAdminStore.ts`:
```typescript
const ADMIN_PASSWORD = 'your-new-password';
```

**Production**: Move to environment variables:
```typescript
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD;
```

---

## 🧪 Test Scenarios

### Test 1: Login Success
**Steps**:
1. Navigate to `/admin`
2. Redirected to `/admin/login`
3. Enter: `mln131admin`
4. Click "Access Dashboard"
5. **Expected**: Redirect to `/admin`, show dashboard

### Test 2: Login Failed
**Steps**:
1. Navigate to `/admin/login`
2. Enter wrong password
3. Click "Access Dashboard"
4. **Expected**: Error message, stay on login page

### Test 3: Logout
**Steps**:
1. Logged in at `/admin`
2. Click "Đăng xuất" in sidebar
3. **Expected**: Redirect to `/admin/login`

### Test 4: Persistent Login
**Steps**:
1. Login successfully
2. Refresh page (F5)
3. **Expected**: Still logged in, stay at `/admin`

### Test 5: Direct Access
**Steps**:
1. Not logged in
2. Navigate to `/admin` directly
3. **Expected**: Redirect to `/admin/login`

---

## 📊 Admin Store

### State:
```typescript
interface AdminState {
    isAuthenticated: boolean;
    login: (password: string) => boolean;
    logout: () => void;
}
```

### Usage:
```tsx
const { isAuthenticated, login, logout } = useAdminStore();

// Login
const success = login('mln131admin');

// Logout
logout();

// Check auth
if (isAuthenticated) {
    // Show protected content
}
```

### Persistence:
```typescript
persist(
    (set) => ({ /* state */ }),
    {
        name: 'admin-auth-storage' // localStorage key
    }
)
```

---

## 🎨 AdminLogin Page Features

### UI Elements:
- ✅ Shield icon with lock badge
- ✅ Password input with icon
- ✅ Error message animation
- ✅ "Quay lại trang chủ" link
- ✅ Default password hint
- ✅ Framer Motion animations

### Styling:
- Swiss Modernism 2.0 aesthetic
- Consistent with app design
- Responsive layout
- Glass-card effect

---

## 🚀 Benefits

### Before:
- ❌ No admin protection
- ❌ Routes in App.tsx
- ❌ Hard to manage
- ❌ Anyone can access admin

### After:
- ✅ Password protected
- ✅ Separated routes
- ✅ Easy to extend
- ✅ Secure admin access
- ✅ Persistent login
- ✅ Clean code structure

---

## 📝 Usage Examples

### Add New Route:
```tsx
// In src/routes/index.tsx
<Route path="/new-page" element={<NewPage />} />
```

### Add Protected Route:
```tsx
<Route 
    path="/protected" 
    element={isAuthenticated ? <ProtectedPage /> : <Navigate to="/admin/login" />} 
/>
```

### Navigate Programmatically:
```tsx
import { useNavigate } from 'react-router-dom';

const navigate = useNavigate();
navigate('/admin');
```

---

## 🔧 Environment Variables (Production)

### .env file:
```
VITE_ADMIN_PASSWORD=your-secure-password
```

### Update useAdminStore.ts:
```typescript
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'mln131admin';
```

---

## ✅ Checklist

- [x] Admin authentication store
- [x] AdminLogin page
- [x] Protected routes
- [x] Logout functionality
- [x] Persistent login
- [x] RoomPage wrapper
- [x] Separated routes
- [x] Clean code structure
- [ ] Environment variables (TODO for production)
- [ ] Password hashing (TODO for production)

---

## 🎉 Ready to Use!

### Access Admin:
1. Navigate to `/admin`
2. Login with `mln131admin`
3. Manage rooms and questions
4. Logout when done

### URLs:
- Home: `/`
- Room: `/room/MLN131-DEMO`
- Admin Login: `/admin/login`
- Admin Dashboard: `/admin`

**Admin giờ được bảo vệ và routes được tổ chức tốt hơn!** 🔐✨
