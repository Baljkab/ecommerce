# Компьютер, технологийн онлайн дэлгүүрийн төлөвлөгөө

## Төслийн зорилго

Hitech шиг компьютер, gaming болон технологийн бараа зардаг онлайн дэлгүүр хийх.

## Барааны үндсэн ангилал

- Laptop
- Gaming PC
- Monitor
- Keyboard
- Mouse
- Headset
- Webcam
- Printer
- SSD / HDD
- RAM
- Video card
- CPU
- Motherboard
- Power supply
- Computer case
- Accessories

Эхний хувилбарт дараах 6 ангиллаас эхэлж болно:

- Laptop
- Gaming PC
- Monitor
- Keyboard
- Mouse
- Headset

## Бүтээгдэхүүний мэдээлэл

Компьютерийн бараанд размерийн оронд техникийн үзүүлэлт чухал.

Бүтээгдэхүүн бүр дараах мэдээлэлтэй байна:

- Нэр
- Брэнд
- Ангилал
- Үнэ
- Зураг
- Тайлбар
- Үлдэгдэл
- Баталгаат хугацаа
- Техникийн үзүүлэлт

Жишээ:

```ts
{
  name: "Gaming Keyboard K530",
  brand: "Redragon",
  category: "Keyboard",
  price: 189000,
  stock: 15,
  warrantyMonths: 12,
  specifications: {
    switch: "Mechanical Red Switch",
    connection: "USB",
    layout: "English",
    lighting: "RGB",
  },
}
```

Laptop-ийн жишээ үзүүлэлт:

```ts
{
  processor: "Intel Core i7",
  ram: "16GB",
  storage: "512GB SSD",
  graphics: "RTX 4060",
  display: "15.6 inch",
  operatingSystem: "Windows 11",
}
```

## Нүүр хуудасны бүтэц

### Hero section

- Компьютер, технологийн барааны гол танилцуулга
- “Бараа үзэх” button
- Шинэ бүтээгдэхүүн эсвэл gaming setup-ийн зураг

### Онцлох ангилал

- Laptop
- Gaming PC
- Monitor
- Keyboard
- Mouse
- Headset

### Шинэ бараа

Бүтээгдэхүүний card бүрт:

- Барааны зураг
- Брэнд
- Нэр
- Товч техникийн үзүүлэлт
- Үнэ
- Үлдэгдэл
- Дэлгэрэнгүй button
- Сагсанд нэмэх button

### Онцлох хямдрал

- Хямдарсан үнэ
- Өмнөх үнэ
- Хямдралын хувь

### Яагаад биднийг сонгох вэ?

- Баталгаат бүтээгдэхүүн
- Найдвартай хүргэлт
- Техникийн зөвлөгөө
- Борлуулалтын дараах үйлчилгээ

## Product detail page

### Зүүн тал

- Барааны том зураг
- Нэмэлт зургууд
- Зураг томруулах боломж

### Баруун тал

- Брэнд
- Барааны нэр
- Үнэ
- Үлдэгдэл
- Баталгаат хугацаа
- Сагсанд нэмэх button

### Доод хэсэг

- Техникийн үзүүлэлт
- Барааны дэлгэрэнгүй тайлбар
- Баталгааны мэдээлэл
- Хүргэлтийн мэдээлэл

## Шүүлтүүр болон хайлт

Бүтээгдэхүүний page дээр дараах боломжуудыг нэмнэ:

- Ангиллаар шүүх
- Брэндээр шүүх
- Үнийн хүрээгээр шүүх
- Нэрээр хайх
- Үнэ өсөх / буурахаар эрэмбэлэх
- Шинээр нэмэгдсэн бараагаар эрэмбэлэх

## Сагсны систем

Сагсанд дараах мэдээлэл хадгална:

- Бараа
- Барааны зураг
- Үнэ
- Тоо ширхэг
- Нийт үнэ

Сагсны харагдац:

- Header дээр “Сагс” button
- Hover хийхэд жижиг cart preview
- Сагсны item бүрт устгах button
- Нийт үнэ
- Checkout button

Жишээ:

```text
Таны сагс (2 бүтээгдэхүүн)

Gaming Mouse
Тоо ширхэг: 1
89,000₮

Mechanical Keyboard
Тоо ширхэг: 1
189,000₮

Нийт: 278,000₮
```

## Supabase database

Бүрэн ecommerce болгох үед Supabase ашиглана.

### categories

- id
- name
- slug

### products

- id
- category_id
- name
- brand
- description
- price
- image_url
- stock
- warranty_months
- created_at

### product_specs

- id
- product_id
- spec_name
- spec_value

### cart_items

- id
- user_id
- product_id
- quantity

### orders

- id
- user_id
- total_price
- status
- shipping_address
- created_at

### order_items

- id
- order_id
- product_id
- quantity
- price

## Хэрэглэгчийн систем

Supabase Auth ашиглан:

- Бүртгүүлэх
- Нэвтрэх
- Гарах
- Нууц үг сэргээх
- Хэрэглэгчийн профайл
- Хүргэлтийн хаяг хадгалах

## Захиалгын төлөв

- pending
- paid
- processing
- shipped
- completed
- cancelled

Үлдэгдлийг сагсанд нэмэх үед биш, захиалга амжилттай баталгаажсаны дараа бууруулах нь зөв.

```text
Сагсанд нэмэх
→ Захиалга үүсгэх
→ Төлбөр баталгаажих
→ Stock бууруулах
```

## Admin хэсэг

Admin хэрэглэгч дараах үйлдлийг хийнэ:

- Бараа нэмэх
- Бараа засах
- Бараа устгах
- Зураг upload хийх
- Үнэ өөрчлөх
- Stock өөрчлөх
- Техникийн үзүүлэлт нэмэх
- Захиалга харах
- Захиалгын төлөв өөрчлөх

## Хөгжүүлэлтийн дараалал

### 1-р үе шат: Дизайн

- Header-ийг tech дэлгүүрийн загварт оруулах
- Нүүр хуудсыг шинэчлэх
- Ангиллын хэсэг хийх
- Product card сайжруулах
- Detail page сайжруулах

### 2-р үе шат: Static demo data

Эхний demo бараанууд:

- Gaming Mouse
- Mechanical Keyboard
- Gaming Headset
- 24-inch Monitor
- Gaming Laptop

### 3-р үе шат: Бүтээгдэхүүний боломжууд

- Хайлт
- Ангиллын шүүлтүүр
- Брэндийн шүүлтүүр
- Үнийн шүүлтүүр
- Эрэмбэлэлт
- Техникийн үзүүлэлт

### 4-р үе шат: Сагс

- Сагсанд нэмэх
- Тоо ширхэг нэмэх / хасах
- Бараа устгах
- Нийт үнэ бодох
- Hover cart preview

### 5-р үе шат: Supabase

- Supabase project үүсгэх
- Database schema үүсгэх
- Supabase client тохируулах
- Static data-г database рүү шилжүүлэх
- Products-ийг database-ээс унших

### 6-р үе шат: Authentication

- Login
- Register
- Logout
- User profile

### 7-р үе шат: Checkout болон захиалга

- Хэрэглэгчийн мэдээлэл
- Хүргэлтийн хаяг
- Захиалга үүсгэх
- Захиалгын төлөв
- Stock бууруулах

### 8-р үе шат: Admin

- Admin login
- Product CRUD
- Stock management
- Order management

### 9-р үе шат: Төлбөр болон deploy

- Төлбөрийн gateway сонгох
- Payment callback шалгах
- Алдаа болон security validation
- Production deploy хийх

## Эхний хийх ажил

Одоогоор дараах дарааллаар эхлэх нь зөв:

1. Tech барааны `Product` type гаргах
2. `lib/products.ts` дотор 5-10 demo бараа нэмэх
3. Product card-ийг техникийн үзүүлэлт харуулдаг болгох
4. Нүүр хуудсыг tech дэлгүүрийн загварт оруулах
5. Ангиллын хэсэг хийх
6. Product detail page дээр техникийн үзүүлэлт харуулах
7. Дараа нь сагсны систем хийх
8. Эцэст нь Supabase database холбох

## Технологийн стек

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- Supabase PostgreSQL
- Supabase Auth
- Supabase Storage
- Next.js API routes эсвэл Server Actions

