# Portfolio — ภาสณัทกร บุญเทศ

เว็บไซต์ Personal Portfolio แบบหน้าเดียว (HTML / CSS / JavaScript ล้วน ไม่ต้องติดตั้งหรือ build)
ธีม Cinematic Dark โทนแดงอุ่น

## ไฟล์ทั้งหมด (วางรวมที่ root ชั้นเดียว)

```
index.html   โครงหน้าเว็บและข้อความหลัก
style.css    สี ธีม และเลย์เอาต์ (แก้สีที่ตัวแปร :root บนสุด)
data.js      ข้อมูลผลงานในป๊อปอัพ ภาพแกลเลอรี และลิงก์ (แก้ที่นี่)
script.js    การทำงานของเว็บ
*.webp       รูปภาพ
assignment9.mp4  วิดีโอผลงาน
```

## เปิดดูในเครื่อง

```bash
python3 -m http.server 8000
# เปิด http://localhost:8000
```

## เผยแพร่บน GitHub Pages

1. สร้าง repository แล้วอัปโหลดไฟล์ทั้งหมดในโฟลเดอร์นี้ไว้ที่ราก (root)
2. ไปที่ Settings → Pages → Source: `Deploy from a branch` → Branch: `main` / `(root)`
3. รอสักครู่ เว็บจะอยู่ที่ `https://<username>.github.io/<repo>/`

## การปรับแต่ง

- **สีธีม**: ตัวแปร `--accent`, `--accent-2`, `--bg` ใน `style.css`
- **เพิ่ม/แก้ผลงาน**: เพิ่มรายการใน `WORKS` ที่ `data.js` และเพิ่มการ์ดใน `index.html` (ใช้ `data-open="ชื่อคีย์"`)
- **ภาพตัวอย่างเมื่อแชร์ลิงก์ (og:image)**: หลังทราบ URL จริงแล้ว ควรเปลี่ยน `profile-2.webp` ใน `index.html` เป็น URL เต็ม เช่น `https://<username>.github.io/<repo>/profile-2.webp`
