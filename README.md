# 🍔 Fast Food App (Project Team Guide)

## 📖 Tổng quan & Công nghệ

Dự án này là một hệ thống đặt đồ ăn nhanh, được xây dựng theo kiến trúc monorepo.

*   **Backend:**
    *   **Framework:** Express.js
    *   **Database:** MongoDB với Mongoose ODM
*   **Mobile App:**
    *   **Framework:** React Native
    *   **Toolkit:** Expo
    *   **Ngôn ngữ:** TypeScript

## 📋 Yêu cầu cần có

Đảm bảo bạn đã cài đặt các công cụ sau trên máy của mình:

*   [Node.js](https://nodejs.org/) (phiên bản 18.x LTS hoặc cao hơn)
*   [NPM](https://www.npmjs.com/) hoặc [Yarn](https://yarnpkg.com/)
*   [MongoDB](https://www.mongodb.com/try/download/community)
*   [Git](https://git-scm.com/)
*   [Expo Go App](https://expo.dev/go) trên điện thoại của bạn.

## 🚀 Cài đặt & Thiết lập

Thực hiện các bước sau để thiết lập dự án trên máy của bạn:

**Bước 1: Clone Repository**
```bash
git clone <URL_REPOSITORY_CUA_BAN>
cd <TEN_THU_MUC_DU_AN>
```

**Bước 2: Cài đặt Dependencies**
Chạy các lệnh sau từ **thư mục gốc** của dự án.
```bash
# Cài đặt cho thư mục gốc (concurrently)
npm install

# Cài đặt cho backend
npm install --prefix backend

# Cài đặt cho app
npm install --prefix app
```
> **Lưu ý:** Chúng ta cần chạy 3 lệnh `install` vì đây là một cấu trúc monorepo với 3 file `package.json` riêng biệt.

**Bước 3: Thiết lập Biến môi trường cho Backend**
File `.env` chứa các thông tin nhạy cảm và sẽ không được đưa lên Git.

1.  Trong thư mục `backend`, tạo một file mới tên là `.env`.
2.  Sao chép nội dung từ file `backend/.env.example` (nếu có) hoặc sử dụng mẫu dưới đây và dán vào file `backend/.env`:

    ```env
    #---------------------------------
    # MONGODB CONFIG
    #---------------------------------
    # Thay 'fast_food_app_db' bằng tên database của bạn
    MONGODB_URI=mongodb://127.0.0.1:27017/fast_food_app_db

    #---------------------------------
    # SERVER CONFIG
    #---------------------------------
    PORT=8000

    #---------------------------------
    # JWT CONFIG
    #---------------------------------
    # Thay thế bằng một chuỗi ký tự bí mật và phức tạp
    JWT_SECRET=your_super_secret_and_long_jwt_key
    ```

## 🏃 Chạy Môi trường Dev

Để bắt đầu phát triển, hãy mở một terminal duy nhất tại **thư mục gốc** của dự án và chạy:

```bash
npm run dev
```

Lệnh này sẽ tự động:
1.  Khởi chạy **Backend Server** tại `http://localhost:8000` với `nodemon`.
2.  Khởi chạy **Metro Bundler** cho ứng dụng **Expo**.

Sau đó, hãy quét mã QR bằng ứng dụng **Expo Go** để mở ứng dụng trên điện thoại của bạn.

## 🌿 Quy trình làm việc với Git (QUAN TRỌNG)

Để đảm bảo sự ổn định của dự án và tránh xung đột, tất cả các thành viên **phải** tuân thủ quy trình sau:

**Nguyên tắc vàng: Không bao giờ push code trực tiếp lên nhánh `main` hoặc `dev`.**

**Bước 1: Bắt đầu một tính năng mới**
Luôn bắt đầu từ phiên bản mới nhất của nhánh `dev`.

```bash
# Chuyển sang nhánh dev
git checkout dev

# Lấy code mới nhất từ remote về
git pull origin dev
```

**Bước 2: Tạo nhánh tính năng (Feature Branch)**
Tên nhánh nên rõ ràng và tuân theo quy ước: `feature/ten-tinh-nang` hoặc `fix/ten-loi`.

```bash
# Ví dụ: Tạo nhánh cho tính năng màn hình đăng nhập
git checkout -b feature/login-screen
```

**Bước 3: Lập trình và Commit thường xuyên**
Thực hiện công việc trên nhánh mới của bạn. Hãy commit các thay đổi một cách thường xuyên với các thông điệp commit rõ ràng.

```bash
# Thêm các file bạn đã thay đổi
git add .

# Viết một commit message ý nghĩa
git commit -m "feat(auth): Xây dựng giao diện màn hình đăng nhập"
```
> **Tip:** Chúng ta nên tuân theo quy ước [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) để các commit message được đồng nhất.

**Bước 4: Đẩy nhánh tính năng lên Repository**
Khi bạn đã hoàn thành hoặc muốn chia sẻ tiến độ, hãy đẩy nhánh của bạn lên GitHub.

```bash
git push origin feature/login-screen
```

**Bước 5: Tạo Pull Request (PR)**
1.  Truy cập repository trên GitHub.
2.  Bạn sẽ thấy một thông báo để tạo **Pull Request** từ nhánh của bạn.
3.  Tạo PR với **nhánh đích là `dev`**.
4.  Điền mô tả chi tiết cho PR và tag các thành viên khác vào để **review code**.
5.  Sau khi PR được duyệt và không có conflict, người tạo PR hoặc quản lý sẽ merge nó vào nhánh `dev`.

## 📂 Cấu trúc Dự án

```
/
├── app/          # Mã nguồn ứng dụng Expo/React Native
├── backend/      # Mã nguồn server Express.js
├── .gitignore
├── package.json  # Script để chạy đồng thời backend và app
└── README.md
```

## ✍️ Tiêu chuẩn Code

*   **Code Formatter:** Dự án sử dụng [Prettier](https://prettier.io/) để đảm bảo code style nhất quán. Hãy chắc chắn bạn đã cài đặt extension Prettier trên editor của mình và bật "Format on Save".
*   **Linter:** [ESLint](https://eslint.org/) được sử dụng để phát hiện các vấn đề và lỗi tiềm ẩn trong code. Vui lòng giải quyết tất cả các cảnh báo của ESLint trước khi tạo Pull Request.
