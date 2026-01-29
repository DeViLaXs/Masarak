import api from "@/lib/axios";

export type RegisterDto = {
  CompanyName: string;
  Email: string;
  PhoneNumber: string;
  Password: string;
  PasswordConfirmation: string;
  Industry: string;
  LogoUrl: File | string;
};

export const authService = {
  register: async (data: RegisterDto) => {
    const formData = new FormData();
    formData.append("CompanyName", data.CompanyName);
    formData.append("Email", data.Email);
    formData.append("PhoneNumber", data.PhoneNumber);
    formData.append("Password", data.Password);
    formData.append("ConfirmPassword", data.PasswordConfirmation);
    formData.append("Industry", data.Industry);
    if (data.LogoUrl instanceof File) {
      formData.append("LogoUrl", data.LogoUrl);
    }

    const res = await api.post("/Account/Register", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  },
};
