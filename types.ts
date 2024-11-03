/* eslint-disable @typescript-eslint/no-explicit-any */
export type TableProps<T> = {
    data: T[];
    columns: Column<T>[];
    onEdit: (item: T) => void;
    onRemove: (item: T) => void;
    title?: string;
  };
  
  export type Column<T> = {
    header: string;
    accessor: keyof T;
    render?: (value: any, row: T) => React.ReactNode;
  };
  
  //address type
  export interface AddressTypes {
    streetAddres: string;
    city: string;
    state: string;
    zipcode: string;
    latitude: number;
    longitude: number;
  }
  export interface UserTypes {
    _id: string;
    role: 'hr' | 'act' | 'user';
    userId: string;
    password: string;
    email: string;
    avatar: string;
    firstName: string;
    lastName: string;
    middleName?: string;
    birthday?: string;
    birthplace?: string;
    address: AddressTypes;
    age: number;
    contact: number;
    rank?: string;
    gender: string;
  }
  
  export interface ApplicantType {
    _id: string;
    applicantId: string;
    status: string;
    schoolId: string;
    enrollmentForm: string;
    recentGrades: string;
    votersReigstration?: string;
    psa: string;
    schoolYear: string;
    statusUpdate: {
      status: string;
      date: Date;
      reason?: string;
      approvedBy?: string;
    }[];
  }
  
  export interface AttendanceType {
    _id: string;
    userId: string;
    date: Date;
    timeIn: string;
    timeOut: string;
    status?: 'present' | 'absent' | 'late' | 'halfday' | 'leave' | 'pending';
    salaryIsPaid?: boolean;
  }
  
  export interface ShiftType {
    _id: string;
    userId: string;
    date: string;
    timeIn: string;
    timeOut: string;
    dutyHours: number;
    off: string[];
    task: string;
    dailyRate: number;
    salaryIsPaid: boolean;
  }
  export interface LeaveType {
    _id: string;
    leaveType: string;
    date: string;
    userId: string;
    status: boolean | string;
  }
  