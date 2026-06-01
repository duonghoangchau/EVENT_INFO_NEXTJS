# Event Information Page - Next.js

Project gồm:
- Trang public hiển thị thông tin sự kiện: `/`
- Trang admin đăng nhập: `/admin/login`
- Trang admin chỉnh nội dung: `/admin`
- Dữ liệu lưu trong `data/site-content.json`, chỉnh trong admin là trang public tự cập nhật, không cần sửa code.

## Cách chạy local

```bash
npm install
cp .env.example .env.local
npm run dev
```

Mở: http://localhost:3000

Admin: http://localhost:3000/admin/login

Tài khoản mặc định:
- Username: `admin`
- Password: `Admin@123456`

## Đổi mật khẩu admin

Tạo SHA256 password mới bằng Node:

```bash
node -e "console.log(require('crypto').createHash('sha256').update('MatKhauMoi').digest('hex'))"
```

Sau đó thay vào `.env.local`:

```env
ADMIN_PASSWORD_HASH=hash_vua_tao
AUTH_SECRET=chuoi_bi_mat_that_dai_va_kho_doan
ADMIN_USERNAME=admin
```

## Bảo mật đã có

- Cookie admin `httpOnly`, `sameSite=lax`, `secure` khi chạy production.
- Token đăng nhập ký bằng HMAC SHA256 qua `AUTH_SECRET`.
- Mật khẩu không lưu plain text, chỉ so sánh SHA256 hash.
- Route admin/API admin kiểm tra đăng nhập trước khi truy cập.
- JSON body giới hạn kích thước khi lưu nội dung.

## Deploy production

Trên server/VPS:

```bash
npm install
npm run build
npm run start
```

Nhớ đổi `AUTH_SECRET` và `ADMIN_PASSWORD_HASH` trước khi public.
