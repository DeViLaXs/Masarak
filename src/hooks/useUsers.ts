import axiosInstance from "@/lib/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const queryKey = {
    users: ["users"],
    userById : (id:string) => ["user", id]
}

export const useUsers = () => {
    return useQuery({
        queryKey: queryKey.users,
        queryFn: async () => {
            const response = await axiosInstance.get('/users');
            return response.data;
        },
    });
};

export const useUserById = (id: string) => {
    return useQuery({
        queryKey: queryKey.userById(id),
        queryFn: async () => {
            const response = await axiosInstance.get(`/users/${id}`);
            return response.data;
        },
    });
};

export const useCreateUsers = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (user: any) => {
            const response = await axiosInstance.post('/users', user);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey:["users",]})
        }
    });
};
export const useCompanyRegister = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (user: any) => {
            const response = await axiosInstance.post('/ ', user);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey:["users",]})
        }
    });
};