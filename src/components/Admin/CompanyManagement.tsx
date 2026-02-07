import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Building2, Plus, Trash2, CheckCircle, XCircle } from 'lucide-react';

export default function CompanyManagement() {
  const [companies, setCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCompany, setNewCompany] = useState({ name: '', email: '', phone: '' });

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('companies').select('*').order('created_at', { ascending: false });
    if (!error) setCompanies(data);
    setLoading(false);
  };

  const handleAddCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from('companies').insert([newCompany]);
    if (!error) {
      setIsModalOpen(false);
      setNewCompany({ name: '', email: '', phone: '' });
      fetchCompanies();
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Building2 className="text-blue-600" /> İlaçlama Firmaları
        </h2>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
        >
          <Plus size={20} /> Yeni Firma Ekle
        </button>
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4">Firma Adı</th>
              <th className="p-4">E-posta</th>
              <th className="p-4">Durum</th>
              <th className="p-4 text-right">İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {companies.map((company) => (
              <tr key={company.id} className="border-b hover:bg-gray-50">
                <td className="p-4 font-medium">{company.name}</td>
                <td className="p-4 text-gray-600">{company.email}</td>
                <td className="p-4">
                  {company.is_active ? 
                    <span className="text-green-600 flex items-center gap-1"><CheckCircle size={16}/> Aktif</span> : 
                    <span className="text-red-600 flex items-center gap-1"><XCircle size={16}/> Pasif</span>
                  }
                </td>
                <td className="p-4 text-right">
                  <button className="text-red-600 hover:bg-red-50 p-2 rounded">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {loading && <div className="p-10 text-center text-gray-500">Yükleniyor...</div>}
      </div>

      {/* Basit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Yeni Firma Kaydı</h3>
            <form onSubmit={handleAddCompany} className="space-y-4">
              <input 
                placeholder="Firma Adı" 
                className="w-full border p-2 rounded"
                value={newCompany.name}
                onChange={e => setNewCompany({...newCompany, name: e.target.value})}
                required 
              />
              <input 
                placeholder="E-posta" 
                className="w-full border p-2 rounded"
                type="email"
                value={newCompany.email}
                onChange={e => setNewCompany({...newCompany, email: e.target.value})}
              />
              <div className="flex gap-2 justify-end mt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-600">İptal</button>
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Kaydet</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}