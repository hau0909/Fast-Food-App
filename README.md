
---

# 🍔 Fast Food App (Project Team Guide)

## 📖 Tổng quan & Công nghệ

Dự án này là một hệ thống đặt đồ ăn nhanh, được xây dựng theo kiến trúc **monorepo**.

* **Backend:**

  * **Framework:** Express.js
  * **Database:** MongoDB với Mongoose ODM

* **Mobile App:**

  * **Framework:** React Native
  * **Toolkit:** Expo
  * **Ngôn ngữ:** TypeScript

* **Frontend (Web):**

  * **Framework:** Next.js
  * **Ngôn ngữ:** TypeScript

---

## 📋 Yêu cầu

Dự án yêu cầu **4 file `package.json` riêng biệt** (root, backend, app, frontend) để quản lý script và dependencies riêng.

---

## 🌱 Thiết lập Biến môi trường

### 1️⃣ Backend (`backend/.env`)

```env
MONGODB_URI=mongodb://127.0.0.1:27017/fast_food_app_db
PORT=8000
JWT_TOKEN_SECRET=your_super_secret_and_long_jwt_key
```

### 2️⃣ App (Expo/React Native) (`app/.env`)

> Lưu ý: `EXPO_PUBLIC_API_URL` cần cập nhật mỗi khi chạy Expo (Metro Bundler cung cấp URL mới).

```env
EXPO_PUBLIC_API_URL=http://{exp_url}:8000
EXPO_PUBLIC_JWT_TOKEN_SECRET=abc123
```

Ví dụ khi Expo cung cấp URL `exp://192.168.1.100:19000`:

```env
EXPO_PUBLIC_API_URL=http://192.168.1.100:8000
EXPO_PUBLIC_JWT_TOKEN_SECRET=abc123
```

### 3️⃣ Frontend (Next.js) (`frontend/.env`)

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

## ⚡ Cài đặt Dependencies

Trước khi chạy dev, **mỗi phần cần cài dependencies riêng**:

### Root

```bash
cd {root_folder}
npm install
```

### Backend

```bash
cd backend
npm install
```

### App (Expo)

```bash
cd app
npm install
```

### Frontend (Next.js)

```bash
cd frontend
npm install
```

> Sau khi cài xong, trở về **root** để chạy lệnh dev đồng thời.

---

## 🏃 Chạy Môi trường Dev

Tại **thư mục gốc** của dự án:

```bash
npm run dev
```

Lệnh này sẽ tự động:

1. Khởi chạy **Backend Server** tại `http://localhost:8000` với `nodemon`.
2. Khởi chạy **Metro Bundler** cho ứng dụng **Expo**.
3. Nếu có frontend, khởi chạy Next.js server (nếu script dev được cấu hình).

> Sau đó, quét mã QR bằng ứng dụng **Expo Go** để mở app trên điện thoại.

---

## 🌿 Quy trình làm việc với Git (QUAN TRỌNG)

**Nguyên tắc vàng:** Không push code trực tiếp lên nhánh `main` hoặc `dev`.

### Bước 1: Bắt đầu tính năng mới

```bash
git checkout dev
git pull origin dev
```

### Bước 2: Tạo nhánh tính năng (Feature Branch)

```bash
git checkout -b feature/ten-tinh-nang
```

### Bước 3: Commit thường xuyên

```bash
git add .
git commit -m "feat(auth): Xây dựng giao diện màn hình đăng nhập"
```

> Tip: Tuân theo [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/).

### Bước 4: Đẩy nhánh lên Repository

```bash
git push origin feature/ten-tinh-nang
```

### Bước 5: Tạo Pull Request (PR)

1. Truy cập repository trên GitHub.
2. Tạo PR từ nhánh của bạn với **nhánh đích là `dev`**.
3. Điền mô tả chi tiết, tag reviewer, merge sau khi được duyệt.

---

## 📂 Cấu trúc Dự án

```
/
├── app/          # Mã nguồn ứng dụng Expo/React Native
├── backend/      # Mã nguồn server Express.js
├── frontend/     # (Nếu có) Next.js
├── .gitignore
├── package.json  # Script root chạy backend + app (+ frontend nếu có)
└── README.md
```

---

## ✍️ Tiêu chuẩn Code

* **Code Formatter:** [Prettier](https://prettier.io/) → bật "Format on Save".
* **Linter:** [ESLint](https://eslint.org/) → giải quyết tất cả cảnh báo trước khi PR.

---

## 🔹 Lưu ý quan trọng

1. `.env` **không được push lên Git**.
2. Cập nhật URL Expo (`EXPO_PUBLIC_API_URL`) theo địa chỉ local hoặc network mỗi lần chạy.
3. Đặt tên biến môi trường thống nhất giữa app & frontend (`API_URL`) để dễ quản lý.
4. Luôn pull nhánh `dev` mới nhất trước khi bắt đầu tính năng mới.

---

