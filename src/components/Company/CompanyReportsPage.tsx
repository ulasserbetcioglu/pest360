import React, { useState } from 'react';
import { useLanguage } from '../../hooks/useLanguage';
import {
  FileText,
  Download,
  Calendar,
  TrendingUp,
  Users,
  MapPin,
  DollarSign,
  BarChart3,
  Filter,
  Eye
} from 'lucide-react';

const CompanyReportsPage: React.FC = () => {
  const { t } = useLanguage();
  const [dateRange, setDateRange] = useState('30');
  const [reportType, setReportType] = useState('overview');

  // Demo report data
  const reportData = {
    overview: {
      totalVisits: 156,
      completedVisits: 142,
      totalCustomers: 24,
      activeOperators: 6,
      monthlyRevenue: 28500,
      averageVisitCost: 182
    },
    trends: {
      visitsByMonth: [
        { month: 'Ocak', visits: 45, revenue: 8200 },
        { month: 'Şubat', visits: 52, revenue: 9500 },
        { month: 'Mart', visits: 59, revenue: 10800 }
      ]
    }
  };

  const exportReport = (format: 'pdf' | 'excel') => {
    console.log(`Exporting report as ${format}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t('nav.reports')}</h1>
          <p className="text-gray-600 mt-2">Firma performans analizi ve raporlar</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => exportReport('excel')}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Excel</span>
          </button>
          <button
            onClick={() => exportReport('pdf')}
            className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>PDF</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="overview">Genel Bakış</option>
                <option value="visits">Ziyaret Analizi</option>
                <option value="customers">Müşteri Analizi</option>
                <option value="operators">Operatör Performansı</option>
                <option value="revenue">Gelir Analizi</option>
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-gray-400" />
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="7">Son 7 Gün</option>
                <option value="30">Son 30 Gün</option>
                <option value="90">Son 3 Ay</option>
                <option value="365">Son 1 Yıl</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Toplam Ziyaret</p>
              <p className="text-3xl font-bold text-gray-900">{reportData.overview.totalVisits}</p>
              <p className="text-sm text-green-600 mt-1">Bu ay</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <MapPin className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Tamamlanan</p>
              <p className="text-3xl font-bold text-gray-900">{reportData.overview.completedVisits}</p>
              <p className="text-sm text-green-600 mt-1">%{Math.round((reportData.overview.completedVisits / reportData.overview.totalVisits) * 100)} başarı</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Aylık Gelir</p>
              <p className="text-3xl font-bold text-gray-900">₺{reportData.overview.monthlyRevenue.toLocaleString()}</p>
              <p className="text-sm text-green-600 mt-1">+8% geçen aya göre</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Aktif Müşteri</p>
              <p className="text-3xl font-bold text-gray-900">{reportData.overview.totalCustomers}</p>
              <p className="text-sm text-blue-600 mt-1">+3 bu ay</p>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Aktif Operatör</p>
              <p className="text-3xl font-bold text-gray-900">{reportData.overview.activeOperators}</p>
              <p className="text-sm text-green-600 mt-1">Tümü aktif</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Ortalama Ziyaret Ücreti</p>
              <p className="text-3xl font-bold text-gray-900">₺{reportData.overview.averageVisitCost}</p>
              <p className="text-sm text-blue-600 mt-1">Demo hesaplama</p>
            </div>
            <div className="p-3 bg-orange-50 rounded-lg">
              <BarChart3 className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <BarChart3 className="w-5 h-5 mr-2" />
            Aylık Ziyaret Trendi
          </h3>
          <div className="space-y-4">
            {reportData.trends.visitsByMonth.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{item.month}</span>
                <div className="flex items-center space-x-3">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${(item.visits / 60) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-900 w-8">{item.visits}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2" />
            Aylık Gelir Trendi
          </h3>
          <div className="space-y-4">
            {reportData.trends.visitsByMonth.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{item.month}</span>
                <div className="flex items-center space-x-3">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full"
                      style={{ width: `${(item.revenue / 12000) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-900 w-16">₺{item.revenue.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Reports */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <FileText className="w-5 h-5 mr-2" />
          Son Raporlar
        </h3>
        
        <div className="text-center py-8">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Henüz oluşturulmuş rapor bulunmuyor.</p>
        </div>
      </div>
    </div>
  );
};

export default CompanyReportsPage;