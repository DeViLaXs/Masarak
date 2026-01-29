import api from "@/lib/axios";

export type RegisterDto = {
    companyName: string;
    email: string;
    password: string;
    passwordConfirmation: string;
    phoneNumber: string;
    industry: string;
};

export const authService = {
    register: async (data: RegisterDto) => {
        const res = await api.post("/Account/Register", data);
        return res.data;
    },
}
