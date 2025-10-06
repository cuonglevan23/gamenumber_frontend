# 🎮 Game Number - Frontend

Ứng dụng web game đoán số được xây dựng với Next.js 15, TypeScript, Tailwind CSS v4 và shadcn/ui.

## 📋 Mục lục

- [Giới thiệu](#giới-thiệu)
- [Công nghệ sử dụng](#công-nghệ-sử-dụng)
- [Yêu cầu hệ thống](#yêu-cầu-hệ-thống)
- [Cài đặt](#cài-đặt)
- [Chạy ứng dụng](#chạy-ứng-dụng)
- [Giao diện ứng dụng](#giao-diện-ứng-dụng)
- [Tính năng](#tính-năng)
- [Cấu trúc thư mục](#cấu-trúc-thư-mục)
- [API Documentation](#api-documentation)

## 🎯 Giới thiệu

Game Number là một trò chơi đoán số trực tuyến với hệ thống xác thực người dùng, bảng xếp hạng, và thanh toán tích hợp. Người chơi đoán số từ 1-5, kiếm điểm và cạnh tranh với người chơi khác trên bảng xếp hạng.

## 🛠 Công nghệ sử dụng

- **Framework:** [Next.js 15](https://nextjs.org/) (App Router)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **UI Components:** [shadcn/ui](https://ui.shadcn.com/) (New York style)
- **HTTP Client:** [Axios 1.12.2](https://axios-http.com/)
- **State Management:** [React Query (TanStack Query) 5.90.2](https://tanstack.com/query)
- **Form Validation:** [Zod 4.1.11](https://zod.dev/) + [React Hook Form 7.64.0](https://react-hook-form.com/)
- **Date Formatting:** [date-fns 4.1.0](https://date-fns.org/)
- **Notifications:** [Sonner](https://sonner.emilkowal.ski/)
- **Payment:** Stripe Integration

## 📦 Yêu cầu hệ thống

- Node.js 18.x trở lên
- pnpm 9.x trở lên (hoặc npm/yarn)
- Git

## 🚀 Cài đặt

### 1. Clone repository từ GitHub

```bash
git clone https://github.com/cuonglevan23/gamenumber_frontend.git
cd gamenumber_frontend
```

### 2. Cài đặt dependencies

```bash
pnpm install
# hoặc
npm install
# hoặc
yarn install
```

### 3. Cấu hình môi trường

Tạo file `.env.local` trong thư mục root:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1
```

> **Lưu ý:** Backend API phải chạy trên `http://localhost:8080`

## ▶️ Chạy ứng dụng

### Development mode

```bash
pnpm dev
# hoặc
npm run dev
# hoặc
yarn dev
```

Mở [http://localhost:3000](http://localhost:3000) để xem ứng dụng.

### Production build

```bash
pnpm build
pnpm start
```

## 📸 Giao diện ứng dụng

## Screenshots

### 1. Đăng nhập & Đăng ký
![Đăng nhập và đăng ký](docs/ảnh%20/giao%20diện%20đăng%20nhập%20và%20đăng%20ký.png)

Trang xác thực người dùng với 2 tabs:
- **Đăng nhập:** Username + Password
- **Đăng ký:** Username (3-50 ký tự) + Email + Password (min 6 ký tự)

### 2. Dashboard
![Giao diện dashboard](docs/ảnh%20/giao%20diện%20dashboard.png)

Trang chính hiển thị:
- Thống kê điểm số và lượt chơi với progress bars
- Trạng thái tài khoản (Active/Inactive)
- Hạng của người chơi (Bronze/Silver/Gold)
- Quick actions (Chơi Game, Lịch sử, Mua lượt chơi)
- Thông tin tài khoản chi tiết

### 3. Giao diện Game
![Giao diện game](docs/ảnh%20/giao%20diện%20game.png)

Màn hình chơi game:
- Chọn số từ 1-5
- Hiển thị lượt chơi còn lại
- Kết quả trận đấu trước
- Toast notifications cho kết quả
- Auto-refresh user data sau mỗi lượt chơi

### 4. Lịch sử chơi game
![Lịch sử chơi game](docs/ảnh%20/lịch%20sử%20chơi%20game.png)

Theo dõi lịch sử:
- Danh sách các lượt chơi (mới nhất trước)
- Số đã đoán vs số đúng
- Kết quả thắng/thua với badge màu
- Điểm nhận được
- Thống kê tổng quan (Tổng lượt, Thắng, Thua, Tỉ lệ thắng)

### 5. Bảng xếp hạng
![Bảng xếp hạng](docs/ảnh%20/bảng%20xếp%20hạng%20.png)

Leaderboard top 100:
- Top 3 podium với Crown/Medal/Award icons
- Rank của người dùng hiện tại
- Avatar với initials
- Điểm số và user ID
- Auto-refresh mỗi 5 phút

### 6. Mua thêm lượt chơi
![Mua thêm điểm](docs/ảnh%20/mua%20thêm%20điểm%20.png)

Cửa hàng với 2 phương thức:
- **Mua trực tiếp:** 4 gói ($0.40 - $4.00), không thời hạn
- **Stripe Payment:** 3 gói subscription (Monthly $9.99, Quarterly $24.99, Yearly $89.99)

### 7. Lịch sử giao dịch
![Lịch sử giao dịch](docs/ảnh%20/lịch%20sử%20giao%20dịch.png)

Quản lý giao dịch:
- Lịch sử mua lượt qua Direct và Stripe
- Icons phân biệt payment method
- Status badges (Thành công/Đang xử lý/Thất bại)
- Thông tin subscription plan
- Thống kê tổng quan (Tổng giao dịch, Lượt đã mua, Chi tiêu)

## ✨ Tính năng

### 🔐 Xác thực & Bảo mật
- JWT Authentication (Access token 15 phút + Refresh token 7 ngày)
- HttpOnly cookies cho refresh token
- Automatic token refresh on 401
- Memory-based access token storage (không dùng localStorage)
- Protected routes với middleware

### 🎮 Game Features
- Đoán số 1-5 với tỉ lệ thắng cấu hình được
- Real-time score updates
- Distributed locking để tránh race condition
- Game history tracking

### 💳 Payment Integration
- **Direct Payment:** Mua nhanh với USD
- **Stripe Integration:** 
  - Checkout session
  - Subscription plans (Monthly/Quarterly/Yearly)
  - Success/Cancel callbacks
  - Auto-add turns after payment

### 📊 Leaderboard & Stats
- Top 100 players
- Real-time ranking
- User rank display
- Auto-refresh mechanism

### 🎨 UI/UX
- Responsive design (mobile-first)
- Sidebar navigation với mobile support
- Dark mode ready (Tailwind CSS)
- Toast notifications (Sonner)
- Loading states & skeletons
- Error handling với user-friendly messages

## 📁 Cấu trúc thư mục

```
gamenumber_nextjs/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── auth/              # Đăng nhập/Đăng ký
│   │   ├── dashboard/         # Trang chính
│   │   ├── game/              # Giao diện game
│   │   ├── history/           # Lịch sử chơi
│   │   ├── leaderboard/       # Bảng xếp hạng
│   │   ├── shop/              # Mua lượt chơi
│   │   ├── transactions/      # Lịch sử giao dịch
│   │   ├── payment/           # Payment callbacks
│   │   └── layout.tsx         # Root layout
│   ├── components/            # React components
│   │   ├── ui/               # shadcn/ui components
│   │   ├── auth/             # Auth forms
│   │   ├── game/             # Game components
│   │   ├── layout/           # Layout components
│   │   └── payment/          # Payment components
│   ├── contexts/             # React contexts
│   │   └── auth-context.tsx # Auth state management
│   ├── hooks/                # Custom hooks
│   │   ├── useAuth.ts
│   │   ├── useGameHistory.ts
│   │   ├── useLeaderboard.ts
│   │   └── useTransactions.ts
│   ├── lib/                  # Utilities
│   │   ├── axios.customize.ts # Axios instance + interceptors
│   │   └── utils.ts          # Helper functions
│   ├── services/             # API services
│   │   ├── auth.service.ts
│   │   ├── game.service.ts
│   │   ├── user.service.ts
│   │   └── transaction.service.ts
│   ├── types/                # TypeScript types
│   │   ├── auth.ts
│   │   ├── game.ts
│   │   ├── leaderboard.ts
│   │   └── transaction.ts
│   └── providers/            # App providers
│       └── react-query-provider.tsx
├── docs/                     # Documentation
│   ├── API_DOCUMENTATION.md
│   └── STRIPE_PAYMENT_GUIDE.md
├── public/                   # Static assets
└── components.json           # shadcn/ui config
```

## 📚 API Documentation

Xem chi tiết API tại:
- [API Documentation](docs/API_DOCUMENTATION.md) - REST API endpoints
- [Stripe Payment Guide](docs/STRIPE_PAYMENT_GUIDE.md) - Payment integration

### Backend Repository

Backend Spring Boot: [gamenumber_backend](https://github.com/cuonglevan23/gamenumber_backend)

### Các API Endpoints chính:

**Authentication:**
- `POST /api/v1/auth/register` - Đăng ký
- `POST /api/v1/auth/sign-in` - Đăng nhập
- `POST /api/v1/auth/refresh-token` - Refresh token
- `POST /api/v1/auth/logout` - Đăng xuất

**Game:**
- `POST /api/v1/game/guess` - Đoán số
- `GET /api/v1/game/history` - Lịch sử game

**User:**
- `GET /api/v1/me` - Thông tin user
- `GET /api/v1/leaderboard` - Bảng xếp hạng

**Payment:**
- `POST /api/v1/buy-turns` - Mua lượt (Direct/Stripe)
- `GET /api/v1/transactions` - Lịch sử giao dịch
- `GET /api/v1/payment/success` - Stripe callback
- `GET /api/v1/payment/cancel` - Stripe cancel

## 🔧 Scripts

```bash
pnpm dev          # Chạy dev server
pnpm build        # Build production
pnpm start        # Chạy production build
pnpm lint         # Chạy ESLint
```

## 🌐 Deploy

### Vercel (Recommended)

1. Push code lên GitHub
2. Import project từ [Vercel](https://vercel.com/new)
3. Cấu hình environment variables:
   ```
   NEXT_PUBLIC_API_URL=https://your-backend-api.com/api/v1
   ```
4. Deploy

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 🤝 Contributing

1. Fork repository
2. Tạo branch mới (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Tạo Pull Request

## 📝 License

MIT License - xem file [LICENSE](LICENSE) để biết thêm chi tiết.

## 👥 Authors

- **Cuong Le Van** - [cuonglevan23](https://github.com/cuonglevan23)

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [React Query](https://tanstack.com/query)
- [Stripe](https://stripe.com/)

---

⭐ Star repository nếu bạn thấy hữu ích!
