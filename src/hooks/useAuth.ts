import { authService } from "@/services/authService";
import { useQuery, useMutation, Mutation } from "@tanstack/react-query";



export const useRegister = () => {
    return useMutation({
        mutationFn:authService.register,
    })
};
