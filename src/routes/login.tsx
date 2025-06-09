import { createFileRoute, Navigate } from "@tanstack/react-router";
import { SubmitHandler } from "react-hook-form";
import { useAuthentication } from "../contexts/authentication";
import { LoginRequestData } from "../types/auth.types";
import { useAuthLogin } from "../hooks/features/use-auth";
import LoginForm from "../components/organisms/auth/LoginForm";

type SearchParams = {
  redirect?: string;
};

export const LoginPage: React.FC = () => {
  const { redirect } = Route.useSearch();
  const { state } = useAuthentication();
  const { mutate, isPending, error } = useAuthLogin();

  const onSubmit: SubmitHandler<LoginRequestData> = async (data) => {
    mutate(data);
  };

  if (state.isAuthenticated) {
    return <Navigate to={redirect ?? '/'} />;
  }

  return (
    <LoginForm
      isLoading={isPending}
      error={error}
      onSubmit={onSubmit}
    />
  );
};

export const Route = createFileRoute("/login")({
  validateSearch: (search): SearchParams => {
    return {
      redirect: typeof search.redirect === "string" ? search.redirect : undefined,
    }
  },
  component: LoginPage,
});
