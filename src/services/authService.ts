import api from "@/lib/axios";

export type RegisterDto = {
  CompanyName: string;
  Email: string;
  Password: string;
  PasswordConfirmation: string;
  PhoneNumber: string;
  Industry: string;
};

export const authService = {
  register: async (data: RegisterDto) => {
    const res = await api.post("/Account/Register", data);
    return res.data;
  },
};
