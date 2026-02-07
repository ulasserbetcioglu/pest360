# Pest360 Giriş Bilgileri

## Sistem Mimarisi

### Auth Yapısı
- **Admin**: Supabase Auth kullanır (@pest360.com email adresleri)
- **Diğer Kullanıcılar**: Local auth (profiles tablosunda bcrypt ile hash'lenmiş şifre)

## Admin Kullanıcısı

**E-posta:** admin@pest360.com
**Şifre:** admin123

Admin panelde:
- ✅ Tüm firmaları görüntüleme
- ✅ Firma onaylama/reddetme
- ✅ **YENİ: Firma oluşturma** (email + şifre ile)
- ✅ Raporlar ve istatistikler

## Firma Oluşturma (Admin)

Admin kullanıcısı artık doğrudan firma oluşturabilir:
1. Sol menüden "Firma Oluştur" linkine tıklayın
2. Firma bilgilerini doldurun
3. Kullanıcı için email ve şifre belirleyin
4. Oluştur butonuna tıklayın

**Önemli:** Admin tarafından oluşturulan firmalar otomatik olarak onaylı (is_approved = true) ve aktif (is_active = true) durumda olur.

## Yeni Firma Kaydı (Public)

Yeni firmalar kayıt sayfasından kaydolabilir. Kayıt sonrası:
- Firma admin onayı bekler (is_approved = false)
- Kullanıcı hesabı pasif durumda olur (is_active = false)
- Admin firma onayladığında her ikisi de aktif olur
- Şifreler bcrypt ile hash'lenerek profiles tablosunda saklanır

## Giriş Sistemi

- **@pest360.com** email'leri -> Supabase Auth ile giriş
- **Diğer email'ler** -> profiles tablosunda password_hash ile lokal giriş

## Sorun Giderme

1. localStorage'ı temizleyin: `localStorage.clear()`
2. Sayfayı yenileyin
3. Tekrar giriş yapın
