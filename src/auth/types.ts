// src/auth/types.ts
export type User = {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  industry: string;
  role: "Admin"| "Company";
};
