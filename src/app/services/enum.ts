// ─── Enums ───────────────────────────────────────────────────────────────────

export enum E_ListName {
  None = 0,
  Manufacturers = 1,
  Insurances = 2,
  Drugs = 3,
  Providers = 4,
  ID340B = 5,
  AcceptableOutdates = 6,
  PaymentTypes = 7,
  InsuranceTypes = 8,
  InvoiceTypes = 9,
  InvoiceStatus = 10,
  Clients = 11,
  UserTypes = 12,
  ProphyPRN = 13,
  GenderTypes = 14,
}

export enum E_LockUnlock {
  Unlock = 0,
  Lock = 1,
  Value2 = 2,
}

export enum E_TaskStatus {
  None = 0,
  InProgress = 1,
  Completed = 2,
}

export enum E_UserAccess {
  FullAccess = 1,
  LimitedAccess = 2,
  NoAccess = 3,
}

export enum E_DashboardView {
  FullView = 0,
  UnbilledView = 1,
  BilledView = 2,
  ALL = 3,
}

export enum E_OrderAge {
  NonZero = 0,
  Zero = 1,
  ALL = 2,
}

export const GENDER_MAP: Record<number, string> = {
  0: 'Unknown',
  1: 'Male',
  2: 'Female',
  3: 'Other',
};
