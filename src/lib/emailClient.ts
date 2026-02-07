// src/lib/emailClient.ts
import { supabase } from './supabase';

export const sendEmail = async (
  to: string,
  subject: string,
  htmlContent: string
): Promise<void> => {
  console.log(`Sending email to: ${to}, Subject: ${subject}`);
  // Gerçek bir uygulamada, burada bir e-posta hizmetiyle entegrasyon yaparsınız.
  // Örneğin, bir Supabase Edge Function veya SendGrid/Resend'e doğrudan API çağrısı.
  // Bu bir yer tutucudur.
  console.log('Email content:', htmlContent);
  // Örnek: await fetch('/api/send-email', { method: 'POST', body: JSON.stringify({ to, subject, htmlContent }) });
};

export const getRecipientEmails = async (
  customerId: string,
  branchId: string | null
): Promise<string[]> => {
  // İlgili e-posta adreslerini getirme mantığını uygulayın.
  // Bu, müşteri iletişim e-postalarını, şube iletişim e-postalarını veya
  // müşteri/şube için yapılandırılmış belirli bildirim e-postalarını içerebilir.
  // Bu bir yer tutucudur.
  console.log(`Fetching recipient emails for customer: ${customerId}, branch: ${branchId}`);
  
  const emails: string[] = [];

  // Müşteri e-postasını getir
  const { data: customerData, error: customerError } = await supabase
    .from('customers')
    .select('email')
    .eq('id', customerId)
    .single();

  if (customerError) {
    console.error('Error fetching customer email:', customerError);
  } else if (customerData?.email) {
    emails.push(customerData.email);
  }

  // Şube iletişim e-postasını getir (eğer varsa)
  if (branchId) {
    // Assuming you might have a contact_person_email field in branches table
    // This is a placeholder - adjust based on your actual schema
    const { data: branchData, error: branchError } = await supabase
      .from('branches')
      .select('contact_person') // Adjust field name based on your schema
      .eq('id', branchId)
      .single();

    if (branchError) {
      console.error('Error fetching branch contact:', branchError);
    }
    // You might extract email from contact_person field or have a separate email field
  }

  // Tekrarlayan e-postaları temizle
  return Array.from(new Set(emails));
};