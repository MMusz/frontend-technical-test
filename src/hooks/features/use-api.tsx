import { useAuthentication } from "../../contexts/authentication";
import { UnauthorizedError } from "../../services/api.service";
import { Nullable } from "../../types/global.types";

export function useApi() {
  const { signout } = useAuthentication();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const privateCall = async (fn: () => Promise<any>): Promise<Nullable<any>> => {
    try {
      return await fn();
    } catch (err) {
      console.log(err);
      if (err instanceof UnauthorizedError) {
        signout();
        return null;
      } else {
        throw err;
      }
    }
  };

  return { privateCall };
}