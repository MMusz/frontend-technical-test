import { useQueryClient } from "@tanstack/react-query";
import { useAuthId, useAuthToken } from "../../contexts/authentication";

export function useQueryProvider() {
  const queryClient = useQueryClient();
  if (!queryClient) {
    throw new Error(
      "useQueryClient must be used within an QueryProvider",
    );
  }

  return queryClient;
}


export function useAuthProvider() {
  const token = useAuthToken();
  if (!token) {
    throw new Error(
      "useAuthToken must be used within an AuthenticationProvider",
    );
  }

  const id = useAuthId();

  return { token, id };
}

export function useProviders() {
  const queryClient = useQueryProvider();
  const authProvider = useAuthProvider();

  return { ...authProvider, queryClient };
}