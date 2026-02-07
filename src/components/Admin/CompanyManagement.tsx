const handleCreateCompanyWithAdmin = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);

  try {
    // 1. Şirketi EKLE veya GÜNCELLE (Upsert Mantığı)
    // onConflict: 'name' diyerek aynı isimli firma varsa hata vermesini engelliyoruz
    const { data: company, error: compError } = await supabase
      .from('companies')
      .upsert({
        name: formData.name,
        tax_number: formData.tax_number,
        tax_office: formData.tax_office,
        full_address: formData.full_address,
        email: formData.email,
        phone: formData.phone,
        authorized_person: formData.authorized_person,
        status: 'approved',
        is_active: true
      }, { onConflict: 'name' }) 
      .select()
      .single();

    if (compError) throw compError;

    // 2. Auth Kullanıcısını Oluştur
    // Burada hata alırsan "User already registered" diyebilir, bu normaldir.
    const { error: authError } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: {
          firstName: formData.authorized_person,
          role: 'company_admin',
          companyId: company.id
        }
      }
    });

    // Eğer kullanıcı zaten varsa hata fırlatmasın, devam etsin
    if (authError && authError.message !== 'User already registered') throw authError;

    alert('İşlem başarıyla tamamlandı!');
    setIsModalOpen(false);
    fetchCompanies();
    
  } catch (err: any) {
    console.error("Hata Detayı:", err);
    alert('Sistem uyarısı: ' + err.message);
  } finally {
    setLoading(false);
  }
};