import { E_TaskStatus } from './enum';

// ─── Enums (moved to enum.ts) ─────────────────────────────────────────────────
export * from './enum';

// ─── Base ─────────────────────────────────────────────────────────────────────

export interface BaseModel {
  id?: number;
  name?: string | null;
  description?: string | null;
  active?: boolean;
}

// ─── Batch Invoice ────────────────────────────────────────────────────────────

export interface BatchInvoice {
  id?: string;           // uuid
  name?: string | null;
  type?: number;
  notes?: string | null;
  chequeNumber?: string | null;
  chequeAmount?: string | null;
  chequeDate?: string;   // date-time
  invoiceDate?: string;  // date-time
  status?: number;
  lastUpdatedBy?: string | null;
  lastUpdatedDate?: string;
  totalUnits?: number;
  totalInvoiceAmount?: number;
}

// ─── Batch Payment ────────────────────────────────────────────────────────────

export interface BatchPayment {
  id?: string;           // uuid
  name?: string | null;
  notes?: string | null;
  totalAmount?: number;
  createdBy?: string | null;
  lastUpdatedBy?: string | null;
  createdDate?: string;
  emailDate?: string;
  reportDate?: string;
  lastUpdatedDate?: string;
}

// ─── Client ───────────────────────────────────────────────────────────────────

export interface ClientModel extends BaseModel {
  contactPerson?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  zip?: string | null;
  email?: string | null;
  phone?: string | null;
}

// ─── Insurance ────────────────────────────────────────────────────────────────

export interface InsuranceModel extends BaseModel {
  type?: number;
}

// ─── List ─────────────────────────────────────────────────────────────────────

// ─── Order Assay ─────────────────────────────────────────────────────────────

export interface OrderAssay {
  orderId?: string;
  assayId?: string | null;
  assay?: number;
  ndc?: string | null;
  qty?: number;
  expDate?: string;
  lot?: string | null;
  rxNumber?: string | null;
  cogPerUnit?: number;
  billPerUnit?: number;
  emergencyService?: string | null;
  notes?: string | null;
  dateOrdered?: string;
  dateReceived?: string;
  poNumber?: string | null;
  confirmationNumber?: string | null;
}

// ─── Order Invoice ────────────────────────────────────────────────────────────

export interface OrderInvoice {
  orderId?: string;
  batchId?: string;
  patientId?: string;
  type?: number;
  notes?: string | null;
  path?: string | null;
  fileName?: string | null;
  units?: number;
  pricePerUnit?: number;
  billedAmount?: number;
  patientName?: string | null;
  drugName?: string | null;
  orderNumber?: string | null;
  dos?: string;
  batchName?: string | null;
  batchDate?: string;
  batchChequeNumber?: string | null;
  batchChequeDate?: string | null;
  batchChequeAmount?: string | null;
  status?: number;
  totalPayment?: number;
}

// ─── Order Payment Client ─────────────────────────────────────────────────────

export interface OrderPaymentClient {
  orderId?: string;
  patientId?: string;
  chequeDate?: string;
  chequeNumber?: string | null;
  amount?: number;
  cache?: number;
  notes?: string | null;
  path?: string | null;
  fileName?: string | null;
  patientName?: string | null;
}

// ─── Order Payment Insurance ──────────────────────────────────────────────────

export interface OrderPaymentInsurance {
  orderId?: string;
  patientId?: string;
  chequeDate?: string;
  chequeNumber?: string | null;
  amount?: number;
  cache?: number;
  notes?: string | null;
  path?: string | null;
  fileName?: string | null;
  patientName?: string | null;
  batchId?: string;
  batchName?: string | null;
  rxNumber?: string | null;
  orderNumber?: string | null;
  totalAmountBilled?: number;
  totalPayments?: number;
  paymentType?: number;
  paymentTypeName?: string | null;
  isPap?: boolean;
  sequence?: number;
}

// ─── Tasks ────────────────────────────────────────────────────────────────────

export interface Tasks {
  code?: string | null;
  name?: string | null;
  index?: number;
  attachdefaultfolder?: string | null;
  steps?: any;
}

// ─── Order ────────────────────────────────────────────────────────────────────

export interface Order {
  id?: string;
  patientId?: string;
  orderNumber?: string | null;
  dos?: string;
  confirmedDOS?: string;
  confirmedDeliveryDate?: string;
  estimatedDeliveryDate?: string;
  orderStatus?: E_TaskStatus;
  deliveryAddress?: string | null;
  nextCallDate?: string;
  prophyOrPRN?: number;
  drugId?: number;
  orderNotes?: string | null;
  drugName?: string | null;
  manufacturerId?: number;
  insuranceId?: number;
  insuranceType?: number;
  manufacturerName?: string | null;
  insuranceName?: string | null;
  totalPrescribedUnit?: number;
  doseCount?: number;
  providerId?: number;
  providerName?: string | null;
  acceptableOutdatesId?: number;
  acceptableOutdatesName?: string | null;
  id340B?: number;
  id340BName?: string | null;
  latestTaskCode?: string | null;
  createdDate?: string;
  createdBy?: number;
  lastUpdatedDate?: string;
  lastUpdateBy?: number;
  details?: any;
  totalUnitsBilled?: number;
  totalPayments?: number;
}

// ─── Order Task ───────────────────────────────────────────────────────────────

export interface OrderTask {
  orderId?: string;
  taskCode?: string | null;
  taskName?: string | null;
  index?: number;
  taskStatus?: E_TaskStatus;
  notes?: string | null;
  lastUpdatedBy?: string;
  lastUpdatedByName?: string | null;
  lastUpdatedDate?: string;
}

// ─── Patient ──────────────────────────────────────────────────────────────────

export interface Patient {
  id?: string;
  mrn?: string | null;
  dob?: string;
  gender?: number;
  firstName?: string | null;
  lastName?: string | null;
  preferredContactMethod?: number;
  email?: string | null;
  phone1?: string | null;
  phone2?: string | null;
  defaultAddressType?: number;
  address1?: string | null;
  address2?: string | null;
  address3?: string | null;
  insuranceId?: number;
  insuranceNumber?: string | null;
  insuranceName?: string | null;
  secondaryInsuranceId?: number;
  secondaryInsuranceNumber?: string | null;
  secondaryInsuranceName?: string | null;
  spaRequired?: number;
  notes?: string | null;
  guardianDetails?: string | null;
  ccsghpp?: string | null;
  ccsghppDate?: string;
  allergies?: string | null;
  diagnosis?: string | null;
  otherMedicalConditions?: string | null;
  access?: string | null;
  caseNumber?: string | null;
}

// ─── User ─────────────────────────────────────────────────────────────────────

export interface User {
  id?: number;
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  loginId?: string | null;
  password?: string | null;
  type?: number;
  isActive?: boolean;
  clientIds?: number[] | null;
}

// ─── Report Response Models ─────────────────────────────────────────────────

export interface OrderInProgress {
  orderId?: string;
  patientId?: string;
  mrn?: string | null;
  patientName?: string | null;
  orderNumber?: string | null;
  drugName?: string | null;
  dos?: string;
  estimatedDeliveryDate?: string;
  totalUnitsBilled?: number;
  totalAmountBilled?: number;
  totalCOGAmount?: number;
  totalPayments?: number;
  totalBalance?: number;
  insuranceId?: number;
  insuranceName?: string | null;
  insuranceType?: number;
  currentTaskCode?: string | null;
  dInvoicePaidCount?: number;
  pInvoicePaidCount?: number;
  patientRecdDate?: string;
  isBilled?: boolean;
}

export interface Report_BatchPaymentAggr_Model {
  orderNumber?: string | null;
  patientName?: string | null;
  patientId?: string;
  orderId?: string;
  dos?: string;
  insuranceName?: string | null;
  unitsBilled?: number;
  amountBilled?: number;
  totalBalance?: number;
  batchName?: string | null;
  chequeNumber?: string | null;
  chequeDate?: string;
  totalPayment?: number;
  totalWriteOff?: number;
  totalAdjustments?: number;
  paymentType?: number;
  chequeDetails?: string | null;
}

export interface Report_BatchPaymentSummary_Model {
  batchId?: string | null;
  batchName?: string | null;
  orderNumber?: string | null;
  patientName?: string | null;
  patientId?: string;
  orderId?: string;
  reportDate?: string;
  dos?: string;
  insuranceName?: string | null;
  unitsBilled?: number;
  amountBilled?: number;
  totalPayment?: number;
  totalBalance?: number;
}

export interface Report_MonthlyInvoice_Model {
  orderId?: string;
  patientId?: string;
  orderNumber?: string | null;
  patientName?: string | null;
  insuranceName?: string | null;
  insuranceType?: number;
  manufacturerName?: string | null;
  dos?: string;
  totalBillAmount?: number;
  totalCogAmount?: number;
  rX1?: string | null;
  rX2?: string | null;
  rX3?: string | null;
  totalPrescribed?: number;
  drugName?: string | null;
  totalUnitsBilled?: number;
  totalPrescribedUnit?: number;
}

export interface Report_OrderAging_Model {
  orderId?: string;
  patientId?: string;
  orderNumber?: string | null;
  patientName?: string | null;
  dos?: string;
  insuranceName?: string | null;
  totalBilledAmout?: number;
  totalBilledUnit?: number;
  totalOrderPayment?: number;
  totalOrderOtherPayment?: number;
  totalBalance?: number;
  days?: number;
  orderNotes?: string | null;
  chequeDetails?: string | null;
  dInvoicePaidCount?: number;
  pInvoicePaidCount?: number;
  amount?: number;
  paymentType?: number;
  chequeNumber?: string | null;
  chequeDate?: string;
  manufacturerName?: string | null;
  drugName?: string | null;
}

export interface Report_OrderDispensedSummary_Model {
  orderId?: string;
  patientId?: string;
  mrn?: string | null;
  orderNumber?: string | null;
  dos?: string;
  patientName?: string | null;
  insuranceName?: string | null;
  insuranceType?: number;
  manufacturerName?: string | null;
  drugName?: string | null;
  totalBilledUnits?: number;
  totalBilledAmount?: number;
  totalCOGAmount?: number;
  totalCOSAmount?: number;
  totalUCDIncome?: number;
  profitMargin?: number;
  totalPrescribedUnits?: number;
}

export interface Report_PaymentReceived_Model {
  patientId?: string;
  orderId?: string;
  orderNumber?: string | null;
  patientName?: string | null;
  insuranceName?: string | null;
  payment?: number;
  checkNumber?: string | null;
  depositDate?: string;
  units?: number;
  actualUnits?: number;
  totalBilledAmount?: number;
  reportDate?: string;
  dos?: string;
  paymentType?: string | null;
}

export interface Report_PurchasingReport_Model {
  orderId?: string;
  patientId?: string;
  patientName?: string | null;
  manufacturerName?: string | null;
  confirmationNumber?: string | null;
  orderNumber?: string | null;
  drugName?: string | null;
  prophyOrPRN?: string | null;
  transactionType?: string | null;
  assay?: number;
  ndc?: string | null;
  lot?: string | null;
  expDate?: string;
  quantity?: number;
  billPerUnit?: number;
  cogPerUnit?: number;
  dateOrdered?: string;
  dateReceived?: string;
  emergencyService?: string | null;
  poNumber?: string | null;
  id340BName?: string | null;
}

// ─── Re-export requests ──────────────────────────────────────────────────────
export * from './request';
