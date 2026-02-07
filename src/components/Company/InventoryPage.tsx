import React, { useState } from 'react';
import { useLanguage } from '../../hooks/useLanguage';
import { Package, Search, Plus, AlertTriangle, TrendingDown, TrendingUp, Calendar, MapPin, Eye, CreditCard as Edit, Filter } from 'lucide-react';

interface InventoryItem {
  id: string;
  productName: string;
  activeIngredient: string;
  currentStock: number;
  minimumStock: number;
  unit: string;
  expirationDate: string;
  supplier: string;
  cost: number;
  location: string;
  lastRestockDate: string;
}

const InventoryPage: React.FC = () => {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'low' | 'critical' | 'expired'>('all');

  // Demo inventory - empty for now
  const inventory: InventoryItem[] = [];

  const filteredInventory = inventory.filter(item => {
    const matchesSearch = item.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.activeIngredient.toLowerCase().includes(searchTerm.toLowerCase());
    
    const isLowStock = item.currentStock <= item.minimumStock;
    const isCritical = item.currentStock <= item.minimumStock * 0.5;
    const isExpired = new Date(item.expirationDate) < new Date();
    
    const matchesFilter = filterStatus === 'all' ||
                         (filterStatus === 'low' && isLowStock) ||
                         (filterStatus === 'critical' && isCritical) ||
                         (filterStatus === 'expired' && isExpired);
    
    return matchesSearch && matchesFilter;
  });

  const getStockStatus = (item: InventoryItem) => {
    const isExpired = new Date(item.expirationDate) < new Date();
    const isCritical = item.currentStock <= item.minimumStock * 0.5;
    const isLow = item.currentStock <= item.minimumStock;

    if (isExpired) {
      return { status: 'Süresi Dolmuş', color: 'bg-red-100 text-red-800', icon: AlertTriangle };
    }
    if (isCritical) {
      return { status: 'Kritik', color: 'bg-red-100 text-red-800', icon: TrendingDown };
    }
    if (isLow) {
      return { status: 'Düşük', color: 'bg-orange-100 text-orange-800', icon: AlertTriangle };
    }
    return { status: 'Normal', color: 'bg-green-100 text-green-800', icon: TrendingUp };
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t('nav.inventory')}</h1>
          <p className="text-gray-600 mt-2">Depo yönetimi ve stok takibi</p>
        </div>
        <button className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <Plus className="w-5 h-5" />
          <span>Ürün Ekle</span>
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Toplam Ürün</p>
              <p className="text-2xl font-bold text-gray-900">0</p>
            </div>
            <div className="p-2 bg-blue-50 rounded-lg">
              <Package className="w-5 h-5 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Düşük Stok</p>
              <p className="text-2xl font-bold text-orange-600">0</p>
            </div>
            <div className="p-2 bg-orange-50 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Kritik Stok</p>
              <p className="text-2xl font-bold text-red-600">0</p>
            </div>
            <div className="p-2 bg-red-50 rounded-lg">
              <TrendingDown className="w-5 h-5 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Süresi Dolan</p>
              <p className="text-2xl font-bold text-red-600">0</p>
            </div>
            <div className="p-2 bg-red-50 rounded-lg">
              <Calendar className="w-5 h-5 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="relative flex-1 max-w-md">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Ürün ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Tüm Ürünler</option>
                <option value="low">Düşük Stok</option>
                <option value="critical">Kritik Stok</option>
                <option value="expired">Süresi Dolan</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Inventory List */}
      {filteredInventory.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Henüz ürün eklenmemiş
          </h3>
          <p className="text-gray-600 mb-6">
            İlk ürününüzü ekleyerek depo yönetimine başlayın.
          </p>
          <button className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mx-auto">
            <Plus className="w-5 h-5" />
            <span>Ürün Ekle</span>
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-4 px-6 font-medium text-gray-900">Ürün</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-900">Stok Durumu</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-900">Son Kullanma</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-900">Konum</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-900">İşlemler</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredInventory.map((item) => {
                  const stockStatus = getStockStatus(item);
                  const StatusIcon = stockStatus.icon;
                  
                  return (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="py-4 px-6">
                        <div>
                          <p className="font-medium text-gray-900">{item.productName}</p>
                          <p className="text-sm text-gray-600">{item.activeIngredient}</p>
                          <p className="text-xs text-gray-500">{item.supplier}</p>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <span className="font-medium text-gray-900">
                              {item.currentStock} {item.unit}
                            </span>
                            <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${stockStatus.color}`}>
                              <StatusIcon className="w-3 h-3 mr-1" />
                              {stockStatus.status}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500">
                            Min: {item.minimumStock} {item.unit}
                          </p>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(item.expirationDate).toLocaleDateString('tr-TR')}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <MapPin className="w-4 h-4" />
                          <span>{item.location}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-2">
                          <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-gray-400 hover:text-green-600 transition-colors">
                            <Edit className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryPage;