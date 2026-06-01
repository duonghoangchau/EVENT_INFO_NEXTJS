# Event Information Page - Next.js

Project gom:
- Trang public hien thi thong tin su kien: `/`
- Trang admin dang nhap: `/admin/login`
- Trang admin chinh noi dung: `/admin`
- Production luu noi dung trong Supabase. Khi chua cau hinh Supabase, app fallback ve `data/site-content.json` de chay local.

## Chay local

```bash
npm install
cp .env.example .env.local
npm run dev
```

Mo: http://localhost:3000

Admin: http://localhost:3000/admin/login

Tai khoan mac dinh:
- Username: `admin`
- Password: `Admin@123456`

## Doi mat khau admin

Tao SHA256 password moi bang Node:

```bash
node -e "console.log(require('crypto').createHash('sha256').update('MatKhauMoi').digest('hex'))"
```

Sau do thay vao `.env.local`:

```env
ADMIN_PASSWORD_HASH=hash_vua_tao
AUTH_SECRET=chuoi_bi_mat_that_dai_va_kho_doan
ADMIN_USERNAME=admin
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## Bao mat da co

- Cookie admin `httpOnly`, `sameSite=lax`, `secure` khi chay production.
- Token dang nhap ky bang HMAC SHA256 qua `AUTH_SECRET`.
- Mat khau khong luu plain text, chi so sanh SHA256 hash.
- Route admin/API admin kiem tra dang nhap truoc khi truy cap.
- JSON body gioi han kich thuoc khi luu noi dung.

## Cau hinh Supabase

1. Tao project trong Supabase.
2. Vao `SQL Editor`, chay file [supabase/site_content.sql](/d:/src/event-info-nextjs/supabase/site_content.sql:1).
3. Lay `Project URL`, `anon key`, va uu tien them `service_role key` trong `Project Settings > API`.
4. Them vao `.env.local` hoac bien moi truong tren Vercel:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

Luu y:
- `SUPABASE_SERVICE_ROLE_KEY` chi dung tren server, khong dua xuong client.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` la tuy chon cho client hoac server fallback, nhung de ghi du lieu on dinh thi nen uu tien `SUPABASE_SERVICE_ROLE_KEY`.
- Khi chua co ban ghi `site-content` trong Supabase, app se doc fallback tu `data/site-content.json`.
- Lan dau vao admin va bam luu, app se upsert noi dung len Supabase.
- Neu da co mot phan env Supabase ma van thieu bien can thiet, route save se bao loi thay vi am tham ghi ve file JSON.

## Deploy production

Tren Vercel:
- Them `AUTH_SECRET`, `ADMIN_USERNAME`, `ADMIN_PASSWORD_HASH`, `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`.
- Neu ban dang dung anon key, them ca `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
- Redeploy sau khi them env.

Tren server/VPS:

```bash
npm install
npm run build
npm run start
```

Nho doi `AUTH_SECRET` va `ADMIN_PASSWORD_HASH` truoc khi public.
