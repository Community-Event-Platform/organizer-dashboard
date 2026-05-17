# EventHub - Organizer Dashboard_nhánh develop
---

Chào mừng bạn đến với **EventHub Organizer Dashboard**, phân hệ web dành cho Nhà tổ chức sự kiện (Organizer) thuộc dự án nền tảng quản lý và kết nối sự kiện cộng đồng **EventHub**. 

Ứng dụng được phát triển bằng **React**, **Vite** và **Vanilla CSS** nhằm mang lại trải nghiệm mượt mà, giao diện tinh tế được tối ưu hóa đồng bộ 100% theo bản thiết kế **Figma**.

---

## 🛠️ Công Nghệ Sử Dụng (Tech Stack)

*   **Frontend Core:** React 18, Vite 8 (HMR cực nhanh, tối ưu dung lượng bundle).
*   **Styling System:** Vanilla CSS (Không dùng TailwindCSS hay framework nặng, kiểm soát hoàn hảo từng pixel, hoạt ảnh micro-animations mượt mà).
*   **Icons:** Bootstrap Icons.
*   **API Integration:** Axios (Đồng bộ thời gian thực với backend Laravel).

---

## ✨ Những Tính Năng Đã Hoàn Thành (Completed Features)

### 1. Hệ thống Xác thực (Authentication System)
*   **Đăng ký & Đăng nhập:** Popup AuthModal chuyên nghiệp, kiểm lỗi đầu vào chặt chẽ, kết nối API Laravel để cấp JWT Token.
*   **Quản lý phiên đăng nhập:** Lưu thông tin bảo mật qua `localStorage`, tự động khôi phục phiên khi tải lại trang.
*   **Đăng xuất an toàn:** Thu hồi token và chuyển hướng thông minh về trang chủ Guest.

### 2. Thanh Điều hướng Vuông vắn (Premium Navbar - Figma Exact)
*   **Đồng bộ trục căn giữa đứng tuyệt đối:** Khóa cứng tâm đứng của logo, các link và nút ở chiều cao `32px` (`inline-flex`), triệt tiêu hoàn toàn hiện tượng lệch trục ("bấp bênh").
*   **Đồng bộ bo góc chuẩn:** Bo góc `4px` cho nút kích hoạt và nút chức năng chuẩn thiết kế Figma.
*   **Trạng thái phân cấp Tab:**
    *   *Chưa đăng nhập:* Hiển thị đậm màu các tab được phép xem (`Home`, `About`); khóa mờ và đổi trỏ `not-allowed` các tab yêu cầu quyền (`Events`, `Participants`).
    *   *Đã đăng nhập:* Kích hoạt sáng toàn bộ các tab chức năng.
*   **Góc hồ sơ cao cấp:** Hiển thị tên người dùng màu **Đỏ Hồng `#EF4444`** nổi bật, kèm Avatar xanh lá chứa icon hình nhân trắng và mũi tên thả xuống `▼` giống hệt Figma.

### 3. Trang Chủ & Slide Giới Thiệu (Hero Carousel)
*   **Slide trình chiếu tự động:** Chuyển cảnh mượt mà mỗi 5 giây với hiệu ứng làm mờ nền (Overlay), hiển thị thẻ danh mục sự kiện (EDM, Art, Tech...) và thông tin địa điểm/thời gian cục bộ sắc nét.
*   **Header thu nhỏ gọn gàng:** Nội dung giới thiệu được căn chỉnh hợp lý, trình bày tối giản trên 2 dòng ở màn hình máy tính thông thường.

### 4. Bảng Điều Khiển Sau Đăng Nhập (Interactive Dashboard)
*   **Các Thẻ Thống Kê Dọc (Vertical Stats Cards):**
    *   3 khối thẻ thông tin trực quan: **Tổng số sự kiện (Total Events)**, **Người tham gia (Participants)**, **Sự kiện đang hoạt động (Active Events)**.
    *   Kích thước nhỏ gọn (`width: 190px`), căn giữa cân đối ở trung tâm màn hình.
    *   **Nổi bật giá trị:** Số liệu người tham gia được tô **màu cam `#f97316`** đồng bộ 100% với Figma.
*   **Bảng Quản lý Danh mục (Categories Table) cực kỳ khít sát:**
    *   Lề dòng (padding) được ép mỏng xuống **`8px`**, loại bỏ khoảng trắng trống trải.
    *   Các nút **`Edit`** (nền xanh lá nhạt) và **`Delete`** (nền hồng nhạt) được thiết kế vuông vắn (`border-radius: 4px`) siêu gọn gàng.
    *   Dễ dàng Thêm, Sửa, Xóa danh mục qua các Popup Modal mượt mà.

### 5. Chân Trang Bảo Vệ Rìa (Compact Footer & Layout Fixes)
*   **Dọn dẹp liên kết:** Loại bỏ hoàn toàn các dòng placeholder chữ `"Updating..."` vô nghĩa.
*   **Ngắt dòng thông minh:** Cấu hình `word-break: break-all` cho địa chỉ Email liên hệ dài giúp chân trang không bị phình to khi thu nhỏ màn hình.
*   **Khóa tràn viền ngang:** Định cấu hình `overflow-x: hidden` và `width: 100%` cho `html` và `body` để loại bỏ vĩnh viễn vệt sọc trắng trống lòi ra ở lề bên phải.

---

## 📅 Kế Hoạch Phát Triển Tuần Tiếp Theo (Next Week Plan)

Trong tuần tiếp theo, phân hệ **Organizer Dashboard** sẽ tập trung phát triển sâu và hoàn thiện các chức năng nghiệp vụ cốt lõi sau:

### 1. Quản Lý Sự Kiện (Events CRUD)
*   **Xem danh sách:** Thiết kế bảng danh sách sự kiện chuyên nghiệp với bộ lọc theo danh mục, trạng thái (Active, Pending, Completed).
*   **Thêm mới sự kiện:** Xây dựng Form thêm sự kiện chi tiết: Tên sự kiện, Mô tả, Thời gian bắt đầu/kết thúc, Địa điểm tổ chức, Banner sự kiện (upload ảnh), và chọn Danh mục tương ứng.
*   **Cập nhật & Xóa:** Cho phép nhà tổ chức chỉnh sửa thông tin chi tiết hoặc hủy/xóa sự kiện khỏi hệ thống (đồng bộ API).

### 2. Nâng Cấp Quản Lý Danh Mục (Categories CRUD)
*   Hoàn thiện toàn diện luồng nghiệp vụ danh mục sự kiện kết nối trực tiếp đến Laravel Backend.
*   Tối ưu hóa các thao tác xử lý lỗi từ máy chủ và phản hồi thông báo (Toast) thông minh tới người dùng.

---

## 🚀 Hướng Dẫn Khởi Chạy (Installation & Run)

1.  **Cài đặt các gói phụ thuộc:**
    ```bash
    npm install
    ```

2.  **Cấu hình môi trường (`.env`):**
    Tạo file `.env` tại thư mục gốc từ file `.env.example` và thiết lập đường dẫn kết nối API Laravel:
    ```env
    VITE_API_URL=http://localhost:8000/api
    ```

3.  **Khởi chạy máy chủ phát triển (Development):**
    ```bash
    npm run dev
    ```
    *Ứng dụng sẽ chạy tại địa chỉ mặc định `http://localhost:5174`.*

4.  **Đóng gói sản phẩm (Production Build):**
    ```bash
    npm run build
    ```

---

* Chúng tôi sẽ tiếp tục hoàn thành xuất sắc đợt phát triển tính năng kế tiếp!* 😉
