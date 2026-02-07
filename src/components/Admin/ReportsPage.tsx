import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../hooks/useLanguage';
import { supabase } from '../../lib/supabase';
import { toast } from 'sonner';
import {
  BarChart3,
  TrendingUp,
  Download,
  Calendar,
  Building2,
  Users,
  MapPin,
  DollarSign,
  Filter
} from 'lucide-react';

const ReportsPage: React.FC = () => {
  const { t } = useLanguage();
  const [dateRange, setDateRange] = useState('30');
  const [reportType, setReportType] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [reportData, setReportData] = useState({
    overview: {
      totalCompanies: 0,
      totalOperators: 0,
      totalCustomers: 0,
      totalVisits: 0,
      totalRevenue: 0,
      averageVisitCost: 0,
      pendingApprovals: 0
    },
    trends: {
      visitsByMonth: [] as { month: string; visits: number }[],
      revenueByMonth: [] as { month: string; revenue: number }[]
    }
  });

  useEffect(() => {
    loadReportData();
  }, [dateRange]);

  const loadReportData = async () => {
    try {
      const { count: totalCompanies } = await supabase
        .from('companies')
        .select('*', { count: 'exact', head: true })
        .eq('is_approved', true);

      const { count: pendingApprovals } = await supabase
        .from('companies')
        .select('*', { count: 'exact', head: true })
        .eq('is_approved', false);

      const { count: totalOperators } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'operator')
        .eq('is_active', true);

      const { count: totalCustomers } = await supabase
        .from('customers')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true);

      const { count: totalVisits } = await supabase
        .from('visits')
        .select('*', { count: 'exact', head: true });

      const totalRevenue = 0;
      const averageVisitCost = 0;

      setReportData({
        overview: {
          totalCompanies: totalCompanies || 0,
          totalOperators: totalOperators || 0,
          totalCustomers: totalCustomers || 0,
          totalVisits: totalVisits || 0,
          totalRevenue: totalRevenue,
          averageVisitCost: averageVisitCost,
          pendingApprovals: pendingApprovals || 0
        },
        trends: {
          visitsByMonth: [],
          revenueByMonth: []
        }
      });
    } catch (error) {
      console.error('Error loading report data:', error);
      toast.error('Rapor verileri yüklenemedi');
    } finally {
      setLoading(false);
    }
  };

  const exportReport = (format: 'pdf' | 'excel') => {
    console.log(`Exporting report as ${format}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Raporlar</h1>
          <p className="text-gray-600 mt-2">Sistem geneli analiz ve raporlar</p>
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
                <option value="companies">Firma Analizi</option>
                <option value="visits">Ziyaret Analizi</option>
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
      {loading ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Yükleniyor...</p>
        </div>
      ) : (
        <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Toplam Firma</p>
              <p className="text-3xl font-bold text-gray-900">{reportData.overview.totalCompanies}</p>
              <p className="text-sm text-green-600 mt-1">Aktif firmalar</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <Building2 className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Toplam Operatör</p>
              <p className="text-3xl font-bold text-gray-900">{reportData.overview.totalOperators}</p>
              <p className="text-sm text-green-600 mt-1">Aktif</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <Users className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Toplam Müşteri</p>
              <p className="text-3xl font-bold text-gray-900">{reportData.overview.totalCustomers}</p>
              <p className="text-sm text-blue-600 mt-1">Aktif müşteriler</p>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <Building2 className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Toplam Ziyaret</p>
              <p className="text-3xl font-bold text-gray-900">{reportData.overview.totalVisits}</p>
              <p className="text-sm text-green-600 mt-1">Bu ay</p>
            </div>
            <div className="p-3 bg-orange-50 rounded-lg">
              <MapPin className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Toplam Gelir</p>
              <p className="text-3xl font-bold text-gray-900">₺{reportData.overview.totalRevenue.toLocaleString()}</p>
              <p className="text-sm text-green-600 mt-1">Bu ay</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Ortalama Ziyaret Maliyeti</p>
              <p className="text-3xl font-bold text-gray-900">₺{Math.round(reportData.overview.averageVisitCost).toLocaleString()}</p>
              <p className="text-sm text-blue-600 mt-1">Ortalama</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <TrendingUp className="w-6 h-6 text-blue-600" />
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
            {reportData.trends.revenueByMonth.map((item, index) => (
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

      {/* System Health */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Sistem Sağlığı</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl font-bold text-green-600">99.9%</span>
            </div>
            <p className="text-sm font-medium text-gray-900">Sistem Uptime</p>
            <p className="text-xs text-gray-600">Son 30 gün</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl font-bold text-blue-600">{reportData.overview.totalCompanies}</span>
            </div>
            <p className="text-sm font-medium text-gray-900">Aktif Firma</p>
            <p className="text-xs text-gray-600">Onaylanmış</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl font-bold text-purple-600">{reportData.overview.pendingApprovals}</span>
            </div>
            <p className="text-sm font-medium text-gray-900">Bekleyen Onay</p>
            <p className="text-xs text-gray-600">Firma başvurusu</p>
          </div>
        </div>
      </div>
      </>
      )}
    </div>
  );
};

export default ReportsPage;