export interface User {
  id: string;
  email: string;
  role: 'admin' | 'company' | 'operator' | 'customer' | 'branch';
  firstName: string;
  lastName: string;
  phone?: string;
  companyId?: string;
  customerId?: string;
  branchId?: string;
  isActive: boolean;
  trialEndDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface BranchEquipment {
  id: string;
  equipment_code: string;
  department: string;
  equipment: {
    id: string;
    name: string;
    properties?: Record<string, {
      type: 'boolean' | 'number' | 'string';
      label: string;
    }>;
  };
}

export interface Visit {
  id: string;
  company_id: string;
  customer: {
    id: string;
    kisa_isim: string;
    cari_isim?: string;
  };
  branch?: {
    id: string;
    sube_adi: string;
    latitude?: number;
    longitude?: number;
  } | null;
  visit_date: string;
  equipment_checks: Record<string, any>;
  pest_types: string[];
  visit_type: string | string[];
  notes: string;
  report_number?: string;
  status?: string;
  report_photo_url?: string;
  report_photo_file_path?: string;
  previous_visit_id?: string;
  previous_visit?: {
    branch?: {
      latitude?: number;
      longitude?: number;
    };
  } | null;
}

export interface BiocidalProduct {
  id: string;
  name: string;
  unit_type: string;
  company_id: string;
}

export interface PaidProduct {
  id: string;
  name: string;
  unit_type: string;
  price: number;
  company_id: string;
}

export interface PaidMaterialItem {
  id: string;
  product: {
    id: string;
    name: string;
  };
  quantity: number;
  unit_price: number;
  total_price: number;
}

export interface BiocidalUsageItem {
  productId: string;
  quantity: string;
  dosage: string;
  unit: string;
}

export interface Company {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  taxNumber: string;
  authorizedPerson: string;
  isApproved: boolean;
  isDemo: boolean;
  trialEndDate: Date;
  settings: CompanySettings;
  createdAt: Date;
  updatedAt: Date;
}

export interface CompanySettings {
  // EK-1 Biyosidal Ürün Uygulama Formu özellikleri
  licenseNumber: string;
  applicationTypes: string[];
  targetPests: string[];
  treatmentMethods: string[];
  equipmentTypes: string[];
  safetyMeasures: string[];
  chemicalProducts: ChemicalProduct[];
  priceList: PriceItem[];
  visitTypes: VisitType[];
}

export interface ChemicalProduct {
  id: string;
  name: string;
  activeIngredient: string;
  concentration: string;
  manufacturer: string;
  registrationNumber: string;
  safetyDataSheet: string;
  applicationRate: string;
  targetPests: string[];
}

export interface PriceItem {
  id: string;
  name: string;
  type: 'material' | 'service';
  price: number;
  unit: string;
  description?: string;
}

export interface VisitType {
  id: string;
  name: string;
  description: string;
  duration: number; // minutes
  price: number;
  requiredEquipment: string[];
  defaultProducts: string[];
}

export interface Customer {
  id: string;
  companyId: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  contactPerson: string;
  contractStartDate: Date;
  contractEndDate: Date;
  isActive: boolean;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Branch {
  id: string;
  customerId: string;
  name: string;
  address: string;
  contactPerson: string;
  phone: string;
  area: number; // m²
  buildingType: string;
  specialRequirements?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Visit {
  id: string;
  companyId: string;
  customerId: string;
  branchId: string;
  operatorId: string;
  visitType: string;
  scheduledDate: Date;
  actualDate?: Date;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  products: VisitProduct[];
  equipment: string[];
  findings: string;
  treatment: string;
  recommendations: string;
  totalCost: number;
  photos: string[];
  signature?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface VisitProduct {
  productId: string;
  quantity: number;
  concentration: string;
  applicationMethod: string;
  targetAreas: string[];
}

export interface InventoryItem {
  id: string;
  companyId: string;
  productId: string;
  currentStock: number;
  minimumStock: number;
  lastRestockDate: Date;
  expirationDate: Date;
  supplier: string;
  cost: number;
  location: string;
}