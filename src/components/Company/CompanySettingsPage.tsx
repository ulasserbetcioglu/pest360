import React, { useState } from 'react';
import { useLanguage } from '../../hooks/useLanguage';
import { Settings, Building2, Save, RefreshCw, Plus, Trash2, CreditCard as Edit, FileText, Shield, Users, Package } from 'lucide-react';

interface CompanySettings {
  // Company Info
  name: string;
  email: string;
  phone: string;
  address: string;
  taxNumber: string;
  authorizedPerson: string;
  
  // EK-1 Biyosidal Ürün Uygulama Formu
  licenseNumber: string;
  applicationTypes: string[];
  targetPests: string[];
  treatmentMethods: string[];
  equipmentTypes: string[];
  safetyMeasures: string[];
  
  // Business Settings
  workingHours: {
    start: string;
    end: string;
  };
  visitTypes: Array<{
    id: string;
    name: string;
    duration: number;
    price: number;
  }>;
  priceList: Array<{
    id: string;
    name: string;
    type: 'material' | 'service';
    price: number;
    unit: string;
  }>;
}

const CompanySettingsPage: React.FC = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('company');
  const [isSaving, setIsSaving] = useState(false);
  
  const [settings, setSettings] = useState<CompanySettings>({
    name: 'Elit İlaçlama Hizmetleri',
    email: 'demo@elimspa.com',
    phone: '+90 212 555 0001',
    address: 'Çankaya, Ankara',
    taxNumber: '1234567890',
    authorizedPerson: 'Ahmet Yılmaz',
    licenseNumber: 'BYS-2024-001',
    applicationTypes: ['İç Mekan İlaçlama', 'Dış Mekan İlaçlama', 'Fumigasyon'],
    targetPests: ['Hamam Böceği', 'Karınca', 'Fare', 'Sinek', 'Sivrisinek'],
    treatmentMethods: ['Sprey Uygulama', 'Jel Uygulama', 'Toz Uygulama', 'Fumigasyon'],
    equipmentTypes: ['El Spreyi', 'Motorlu Sprey', 'Fumigasyon Cihazı', 'ULV Cihazı'],
    safetyMeasures: ['Koruyucu Giysi', 'Solunum Maskesi', 'Eldiven', 'Gözlük'],
    workingHours: {
      start: '08:00',
      end: '18:00'
    },
    visitTypes: [
      { id: '1', name: 'Genel İlaçlama', duration: 120, price: 200 },
      { id: '2', name: 'Fare İlaçlaması', duration: 90, price: 150 }
    ],
    priceList: [
      { id: '1', name: 'Biflex Ultra EC', type: 'material', price: 85, unit: 'Litre' },
      { id: '2', name: 'Genel İlaçlama Hizmeti', type: 'service', price: 200, unit: 'Ziyaret' }
    ]
  });

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSaving(false);
    alert('Ayarlar başarıyla kaydedildi!');
  };

  const addArrayItem = (field: keyof CompanySettings, value: string) => {
    if (value.trim()) {
      setSettings(prev => ({
        ...prev,
        [field]: [...(prev[field] as string[]), value.trim()]
      }));
    }
  };

  const removeArrayItem = (field: keyof CompanySettings, index: number) => {
    setSettings(prev => ({
      ...prev,
      [field]: (prev[field] as string[]).filter((_, i) => i !== index)
    }));
  };

  const tabs = [
    { id: 'company', label: 'Firma Bilgileri', icon: Building2 },
    { id: 'biocidal', label: 'EK-1 Biyosidal Form', icon: FileText },
    { id: 'business', label: 'İş Ayarları', icon: Settings },
    { id: 'pricing', label: 'Fiyatlandırma', icon: Package }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t('nav.settings')}</h1>
          <p className="text-gray-600 mt-2">Firma ayarları ve konfigürasyon</p>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSaving ? (
            <RefreshCw className="w-5 h-5 animate-spin" />
          ) : (
            <Save className="w-5 h-5" />
          )}
          <span>{isSaving ? 'Kaydediliyor...' : 'Kaydet'}</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {/* Company Info Tab */}
          {activeTab === 'company' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Firma Adı
                  </label>
                  <input
                    type="text"
                    value={settings.name}
                    onChange={(e) => setSettings(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Vergi Numarası
                  </label>
                  <input
                    type="text"
                    value={settings.taxNumber}
                    onChange={(e) => setSettings(prev => ({ ...prev, taxNumber: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    E-posta
                  </label>
                  <input
                    type="email"
                    value={settings.email}
                    onChange={(e) => setSettings(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Telefon
                  </label>
                  <input
                    type="tel"
                    value={settings.phone}
                    onChange={(e) => setSettings(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Yetkili Kişi
                  </label>
                  <input
                    type="text"
                    value={settings.authorizedPerson}
                    onChange={(e) => setSettings(prev => ({ ...prev, authorizedPerson: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Adres
                </label>
                <textarea
                  rows={3}
                  value={settings.address}
                  onChange={(e) => setSettings(prev => ({ ...prev, address: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          )}

          {/* Biocidal Form Tab */}
          {activeTab === 'biocidal' && (
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <Shield className="w-5 h-5 text-blue-600" />
                  <h3 className="font-medium text-blue-900">EK-1 Biyosidal Ürün Uygulama Formu</h3>
                </div>
                <p className="text-sm text-blue-700 mt-1">
                  Bu bilgiler resmi raporlarda kullanılacaktır.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lisans Numarası
                </label>
                <input
                  type="text"
                  value={settings.licenseNumber}
                  onChange={(e) => setSettings(prev => ({ ...prev, licenseNumber: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Dynamic Arrays */}
              {[
                { field: 'applicationTypes', label: 'Uygulama Türleri' },
                { field: 'targetPests', label: 'Hedef Zararlılar' },
                { field: 'treatmentMethods', label: 'Tedavi Yöntemleri' },
                { field: 'equipmentTypes', label: 'Ekipman Türleri' },
                { field: 'safetyMeasures', label: 'Güvenlik Önlemleri' }
              ].map(({ field, label }) => (
                <div key={field}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {label}
                  </label>
                  <div className="space-y-2">
                    <div className="flex flex-wrap gap-2">
                      {(settings[field as keyof CompanySettings] as string[]).map((item, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                        >
                          {item}
                          <button
                            onClick={() => removeArrayItem(field as keyof CompanySettings, index)}
                            className="ml-2 text-blue-600 hover:text-blue-800"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        placeholder={`Yeni ${label.toLowerCase()} ekle...`}
                        className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            addArrayItem(field as keyof CompanySettings, e.currentTarget.value);
                            e.currentTarget.value = '';
                          }
                        }}
                      />
                      <button
                        onClick={(e) => {
                          const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                          addArrayItem(field as keyof CompanySettings, input.value);
                          input.value = '';
                        }}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Business Settings Tab */}
          {activeTab === 'business' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Çalışma Saatleri</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Başlangıç Saati
                    </label>
                    <input
                      type="time"
                      value={settings.workingHours.start}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        workingHours: { ...prev.workingHours, start: e.target.value }
                      }))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bitiş Saati
                    </label>
                    <input
                      type="time"
                      value={settings.workingHours.end}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        workingHours: { ...prev.workingHours, end: e.target.value }
                      }))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Ziyaret Türleri</h3>
                <div className="space-y-3">
                  {settings.visitTypes.map((visitType, index) => (
                    <div key={visitType.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                      <div className="flex-1 grid grid-cols-3 gap-4">
                        <input
                          type="text"
                          value={visitType.name}
                          onChange={(e) => {
                            const newVisitTypes = [...settings.visitTypes];
                            newVisitTypes[index].name = e.target.value;
                            setSettings(prev => ({ ...prev, visitTypes: newVisitTypes }));
                          }}
                          className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Ziyaret türü adı"
                        />
                        <input
                          type="number"
                          value={visitType.duration}
                          onChange={(e) => {
                            const newVisitTypes = [...settings.visitTypes];
                            newVisitTypes[index].duration = parseInt(e.target.value);
                            setSettings(prev => ({ ...prev, visitTypes: newVisitTypes }));
                          }}
                          className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Süre (dk)"
                        />
                        <input
                          type="number"
                          value={visitType.price}
                          onChange={(e) => {
                            const newVisitTypes = [...settings.visitTypes];
                            newVisitTypes[index].price = parseFloat(e.target.value);
                            setSettings(prev => ({ ...prev, visitTypes: newVisitTypes }));
                          }}
                          className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Fiyat (₺)"
                        />
                      </div>
                      <button
                        onClick={() => {
                          const newVisitTypes = settings.visitTypes.filter((_, i) => i !== index);
                          setSettings(prev => ({ ...prev, visitTypes: newVisitTypes }));
                        }}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => {
                      const newVisitType = {
                        id: Date.now().toString(),
                        name: '',
                        duration: 60,
                        price: 0
                      };
                      setSettings(prev => ({ ...prev, visitTypes: [...prev.visitTypes, newVisitType] }));
                    }}
                    className="flex items-center space-x-2 px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Ziyaret Türü Ekle</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Pricing Tab */}
          {activeTab === 'pricing' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Fiyat Listesi</h3>
                <div className="space-y-3">
                  {settings.priceList.map((item, index) => (
                    <div key={item.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                      <div className="flex-1 grid grid-cols-4 gap-4">
                        <input
                          type="text"
                          value={item.name}
                          onChange={(e) => {
                            const newPriceList = [...settings.priceList];
                            newPriceList[index].name = e.target.value;
                            setSettings(prev => ({ ...prev, priceList: newPriceList }));
                          }}
                          className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Ürün/Hizmet adı"
                        />
                        <select
                          value={item.type}
                          onChange={(e) => {
                            const newPriceList = [...settings.priceList];
                            newPriceList[index].type = e.target.value as 'material' | 'service';
                            setSettings(prev => ({ ...prev, priceList: newPriceList }));
                          }}
                          className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="material">Malzeme</option>
                          <option value="service">Hizmet</option>
                        </select>
                        <input
                          type="number"
                          value={item.price}
                          onChange={(e) => {
                            const newPriceList = [...settings.priceList];
                            newPriceList[index].price = parseFloat(e.target.value);
                            setSettings(prev => ({ ...prev, priceList: newPriceList }));
                          }}
                          className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Fiyat"
                        />
                        <input
                          type="text"
                          value={item.unit}
                          onChange={(e) => {
                            const newPriceList = [...settings.priceList];
                            newPriceList[index].unit = e.target.value;
                            setSettings(prev => ({ ...prev, priceList: newPriceList }));
                          }}
                          className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Birim"
                        />
                      </div>
                      <button
                        onClick={() => {
                          const newPriceList = settings.priceList.filter((_, i) => i !== index);
                          setSettings(prev => ({ ...prev, priceList: newPriceList }));
                        }}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => {
                      const newPriceItem = {
                        id: Date.now().toString(),
                        name: '',
                        type: 'material' as const,
                        price: 0,
                        unit: ''
                      };
                      setSettings(prev => ({ ...prev, priceList: [...prev.priceList, newPriceItem] }));
                    }}
                    className="flex items-center space-x-2 px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Fiyat Kalemi Ekle</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompanySettingsPage;