export type User = {
  id?: string;
  name: string;
  employeeId?: string;
  email: string;
  phone?: string;
  department?: string;
  profilePicture?: string;
  leaveBalance?: number;

  role: "employee" | "admin";

  approvalStatus:
    | "pending"
    | "approved"
    | "rejected";
};

export type Attendance = {
  _id: string;
  attendanceDate: string;
  checkInAt?: string;
  checkOutAt?: string;
  totalWorkingHours?: number | null;
};
