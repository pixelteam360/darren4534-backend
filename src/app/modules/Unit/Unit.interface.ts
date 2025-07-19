
export type TUnit = {
  id: string;
  name: string;
  floor?: string;
  code: number;
  createdAt: Date;
  updatedAt: Date;
  buildingId: string;
};

export type TAssignTenant = {
  id: string;
  name: string;
  contractMonth: number;
  startDate: Date;
  rentAmount: number;
  createdAt: Date;
  updatedAt: Date;
  unitId: string;
};

export type TUnitForm = {
  id: string;
  renterName: string;
  mobileNumber: string;
  sourceOfIncome: string;
  permanentAddress: string;
  emergencyContact: string;
  reference: string;
  govtIssuedId: string;
  socialSecurityCard: string;
  pdfCopyOfLease: string;
  rentalApplication: string;
  petPolicyForm: string;
  backgroundCheck: string;
  createdAt: Date;
  updatedAt: Date;
  tenantId: string;
  unitId: string;
};


