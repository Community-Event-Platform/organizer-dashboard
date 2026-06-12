# EventHub — Organizer Dashboard

Mô tả
-
Giao diện quản trị (dashboard) cho nhà tổ chức sự kiện thuộc hệ sinh thái EventHub. Ứng dụng giúp tạo/quản lý sự kiện, danh mục, xem báo cáo thống kê và xử lý đăng ký từ người tham dự.

Tính năng chính
-
- Quản lý sự kiện (CRUD): tạo, sửa, hủy sự kiện
- Quản lý danh mục (Categories CRUD)
- Bảng thống kê (events, participants, active events)
- Xác thực nhà tổ chức và quản lý phiên

Tech stack
-
- React + Vite
- Bootstrap / Bootstrap Icons
- Axios cho API calls

Yêu cầu môi trường
-
- Node.js 18+ và npm
- Backend API (Laravel) sẵn sàng ở `VITE_API_URL`

Cài đặt & chạy (phát triển)
-
1. Cài phụ thuộc:

```bash
npm install
```

2. Tạo file môi trường `.env` và thiết lập biến kết nối API:

```env
# Đặt giá trị endpoint API (ví dụ: https://api.example.com). Không commit `.env`.
VITE_API_URL=<API_BASE_URL>
```

3. Chạy local:

```bash
npm run dev
```

Lệnh hữu ích
-
- `npm run dev` — chạy môi trường phát triển
- `npm run build` — build production
- `npm run lint` — chạy ESLint

Triển khai
-
- Xây dựng bằng `npm run build` và phục vụ thư mục `dist/` bằng server tĩnh hoặc tích hợp cùng backend.

Đóng góp
-
1. Tạo branch tính năng từ `main` → nêu rõ mục đích trong PR.
2. Chạy lint và test trước khi mở PR.

Liên hệ
-
Mở issue hoặc liên hệ nhóm phát triển để thảo luận tính năng.
