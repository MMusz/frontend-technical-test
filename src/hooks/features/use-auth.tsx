import { useMutation } from "@tanstack/react-query";
import { useAuthentication } from "../../contexts/authentication";
import { login } from "../../services/auth.service";
import { LoginRequestData } from "../../types/auth.types";

export function useAuthLogin() {
  const { authenticate } = useAuthentication();

  return useMutation({
    mutationFn: (data: LoginRequestData) => login(data.username, data.password),
    onSuccess: ({ jwt }) => {
      authenticate(jwt);
    }
  });
}