import api from "@/lib/axios";

export type RegisterDto = {
  CompanyName: string;
  Email: string;
  PhoneNumber: string;
  Password: string;
  PasswordConfirmation: string;
  Industry: string;
  LogoUrl?: File | null;
};

export type LoginDto = {
  Email: string;
  Password: string;
};

export type VerifyOtpDto = {
  Email: string;
  EmailConfirmationCode: string;
};

export const authService = {
  register: async (data: RegisterDto) => {
    const formData = new FormData();
    formData.append("CompanyName", data.CompanyName);
    formData.append("Email", data.Email);
    formData.append("PhoneNumber", data.PhoneNumber);
    formData.append("Password", data.Password);
    formData.append("PasswordConfirmation", data.PasswordConfirmation);
    formData.append("Industry", data.Industry);
    formData.append("LogoUrl", data.LogoUrl!);

    console.log(formData);
    const res = await api.post("/Account/Register", formData);
    return res.data;
  },

  verifyOtp: async (data: VerifyOtpDto) => {
    const res = await api.post("/Account/VerifyEmail", data);
    return res.data;
  },

  login: async (data: LoginDto) => {
    const res = await api.post("/Account/Login", data);
    return res.data;
  },

  logout: async () => {
    const res = await api.post("/Account/Logout");
    return res.data;
  },

  me: async () => {
    const res = await api.get("/Account/Me");
    return res.data;
  },
};
