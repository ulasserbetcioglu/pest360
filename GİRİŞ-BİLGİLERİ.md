# Pest360 Giriş Bilgileri

## Admin Kullanıcısı

**E-posta:** admin@pest360.com
**Şifre:** admin123

## Test Verileri

Sistemde şu test firmaları bulunmaktadır:

1. **Test İlaçlama Ltd.**
   - E-posta: test@ilaclamafirma.com
   - Onay Durumu: Bekliyor

2. **Onaylı İlaçlama A.Ş.**
   - E-posta: onay@ilaclamafirma.com
   - Onay Durumu: Onaylandı

## Yeni Firma Kaydı

Yeni firmalar kayıt sayfasından kaydolabilir. Kayıt sonrası:
- Firma admin onayı bekler (is_approved = false)
- Kullanıcı hesabı pasif durumda olur (is_active = false)
- Admin firma onayladığında her ikisi de aktif olur

## Sorun Giderme

Eğer "Firmalar yüklenemedi" hatası alıyorsanız:

1. Admin olarak giriş yaptığınızdan emin olun
2. Tarayıcı konsolunu kontrol edin (F12)
3. Sayfayı yenileyip tekrar deneyin
4. localStorage'ı temizleyip tekrar giriş yapın
