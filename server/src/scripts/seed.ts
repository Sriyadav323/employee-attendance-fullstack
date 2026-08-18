import bcrypt from "bcryptjs";

import { connectDb } from "../config/db.js";
import { User } from "../models/User.js";

async function seed() {
  await connectDb();

  const employees = [
    {
      name: "Srikanth Yadav",
      employeeId: "EMP-1001",
      email: "srikanth@company.com",
      password: "Password123",
      phone: "6125551001",
      department: "Engineering",
      leaveBalance: 18,
      role: "employee",
    },

    {
      name: "John Smith",
      employeeId: "EMP-1002",
      email: "john.smith@company.com",
      password: "John@1234",
      phone: "6125551002",
      department: "Quality Engineering",
      leaveBalance: 15,
      role: "employee",
    },

    {
      name: "Emily Johnson",
      employeeId: "EMP-1003",
      email: "emily.johnson@company.com",
      password: "Emily@123",
      phone: "6125551003",
      department: "Human Resources",
      leaveBalance: 20,
      role: "employee",
    },

    {
      name: "Michael Brown",
      employeeId: "EMP-1004",
      email: "michael.brown@company.com",
      password: "Michael@123",
      phone: "6125551004",
      department: "Finance",
      leaveBalance: 16,
      role: "employee",
    },
  ];

  for (const employee of employees) {
    const passwordHash =
      await bcrypt.hash(
        employee.password,
        12
      );

    await User.findOneAndUpdate(
  {
    employeeId: employee.employeeId,
  },
      {
        name: employee.name,
        employeeId: employee.employeeId,
        email: employee.email.toLowerCase(),
        passwordHash,
        phone: employee.phone,
        department: employee.department,
        leaveBalance: employee.leaveBalance,
        role: employee.role,
        approvalStatus: "approved",
        approvedAt: new Date(),
        approvedBy: null,
      },
      {
        upsert: true,
        new: true,
      }
    );

    console.log(
      `Seeded employee: ${employee.email}`
    );
  }

  console.log(
    `${employees.length} employees seeded successfully.`
  );

  process.exit(0);
}

seed().catch((error) => {
  console.error("Seed failed:", error);
  process.exit(1);
});
