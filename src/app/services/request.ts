// ─── Request Models ───────────────────────────────────────────────────────────
// All API request interfaces. Imported types come from models.ts.

import {
  BaseModel,
  BatchInvoice,
  BatchPayment,
  ClientModel,
  E_DashboardView,
  E_ListName,
  E_LockUnlock,
  E_OrderAge,
  E_UserAccess,
  InsuranceModel,
  Order,
  OrderAssay,
  OrderInvoice,
  OrderPaymentClient,
  OrderPaymentInsurance,
  OrderTask,
  Patient,
  Tasks,
  User,
} from './models';

// ─── Batch Invoice ────────────────────────────────────────────────────────────

export interface BatchInvoice_Request {
  clientId?: number;
  invoiceType?: number;
  status?: number[] | null;
  batchName?: string | null;
  ignoreId?: string | null;
  batchId?: string;      // uuid
  model?: BatchInvoice;
  models?: BatchInvoice[] | null;
  batchInvoices?: OrderInvoice[] | null;
}

// ─── Batch Payment ────────────────────────────────────────────────────────────

export interface BatchPayment_Request {
  clientId?: number;
  batchName?: string | null;
  ignoreId?: string;     // uuid
  batchId?: string;      // uuid
  model?: BatchPayment;
  batchPayments?: OrderPaymentInsurance[] | null;
  models?: BatchPayment[] | null;
}

// ─── Client ───────────────────────────────────────────────────────────────────

export interface Client_Request {
  clientId?: number;
  id?: number;
  guid?: string;         // uuid
  models?: ClientModel[] | null;
}

// ─── Insurance ────────────────────────────────────────────────────────────────

export interface Insurance_Request {
  clientId?: number;
  id?: number;
  guid?: string;
  models?: InsuranceModel[] | null;
}

// ─── List ─────────────────────────────────────────────────────────────────────

export interface List_Request {
  clientId?: number;
  id?: number;
  guid?: string;
  listName?: E_ListName;
  models?: BaseModel[] | null;
}

// ─── Order Assay ─────────────────────────────────────────────────────────────

export interface OrderAssay_Request {
  clientId?: number;
  id?: number;
  guid?: string;
  models?: OrderAssay[] | null;
}

// ─── Order Invoice ────────────────────────────────────────────────────────────

export interface OrderInvoice_Request {
  clientId?: number;
  id?: number;
  guid?: string;
  batchGuid?: string;
  invoiceType?: number;
  models?: OrderInvoice[] | null;
}

// ─── Order Payment Client ─────────────────────────────────────────────────────

export interface OrderPaymentsClient_Request {
  clientId?: number;
  id?: number;
  guid?: string;
  models?: OrderPaymentClient[] | null;
}

// ─── Order Payment Insurance ──────────────────────────────────────────────────

export interface OrderPaymentsInsurance_Request {
  clientId?: number;
  id?: number;
  guid?: string;
  batchId?: string;
  models?: OrderPaymentInsurance[] | null;
}

// ─── Orders ───────────────────────────────────────────────────────────────────

export interface Orders_Request {
  clientId?: number;
  id?: number;
  guid?: string;
  orderNumber?: string | null;
  includeDetails?: boolean;
  ignoreOrderId?: string;
  patientId?: string;
  invoiceType?: number;
  order?: Order;
  assays?: OrderAssay[] | null;
  tasks?: Tasks[] | null;
  dateTime?: string;
  notes?: string | null;
  billed?: number;
  e_LockUnlock?: E_LockUnlock;
  orders?: Order[] | null;
  orderAssaysDict?: { [key: string]: OrderAssay[] } | null;
}

// ─── Order Task ───────────────────────────────────────────────────────────────

export interface OrderTask_Request {
  clientId?: number;
  id?: number;
  guid?: string;
  taskCode?: string | null;
  model?: OrderTask;
}

// ─── Patient ──────────────────────────────────────────────────────────────────

export interface Patients_Request {
  clientId?: number;
  id?: number;
  guid?: string;
  mrn?: string | null;
  models?: Patient[] | null;
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export interface Provider_Request {
  clientId?: number;
  id?: number;
  guid?: string;
  models?: BaseModel[] | null;
}

// ─── StaticList ───────────────────────────────────────────────────────────────

export interface StaticList_Request {
  clientId?: number;
  listName?: E_ListName;
  id?: number;
  name?: string | null;
  order?: Order;
  taskCode?: string | null;
  insuranceType?: number;
  drugName?: string | null;
  invoiceType?: number;
  dos?: string;
}

// ─── User ─────────────────────────────────────────────────────────────────────

export interface Users_Request {
  clientId?: number;
  id?: number;
  guid?: string;
  loginId?: string | null;
  emailId?: string | null;
  model?: User;
}

// ─── Report ───────────────────────────────────────────────────────────────────

export interface Report_Request {
  clientId?: number;
  id?: number | null;
  guid?: string | null;         // uuid
  userAccess?: E_UserAccess;
  dashboardView?: E_DashboardView;
  orderAge?: E_OrderAge;
  startDate?: string;           // date-time
  endDate?: string;             // date-time
  type?: number;
}
