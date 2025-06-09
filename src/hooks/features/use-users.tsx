import { useQuery } from "@tanstack/react-query";
import { getUserById, getUsers } from "../../services/user.service";
import { Opt } from "../../types/global.types";
import { User } from "../../types/user.types";
import { useAuthProvider, useProviders, useQueryProvider } from "./use-providers";
import { useApi } from "./use-api";

/**
 * Hook allowing to get cached users
 */
export function useGetUsersFromCache() {
  const queryClient = useQueryProvider();
  
  const getUsersFromCache = () => {
    const queries = queryClient.getQueriesData({ queryKey: ['users'], exact: false });
    const cachedUsers: User[] = queries?.map(([,v]) => v as User) ?? [];
    return cachedUsers;
  }
  
  return {
    getUsersFromCache,
  };
}

/**
 * Hook allowing to retrieve users either from cache or server
 */
export function useGetUsersFromCacheOrServer() {
  const { queryClient, token } = useProviders();
  const { getUsersFromCache } = useGetUsersFromCache();
  const { privateCall } = useApi();

  const fetchUsers = async (ids: string[]) => {
    const cachedUsers: User[] = getUsersFromCache();

    const uncachedUserIds: string[] = ids.filter(id => 
      !cachedUsers.find(ca => ca.id === id)
    );
    const uncachedUsers = uncachedUserIds.length 
      ? await privateCall(() => getUsers(token, uncachedUserIds))
      : [];
    const users = [...cachedUsers, ...uncachedUsers];
    
    users.forEach(el => {
      queryClient.setQueryData(['users', el.id], el);
    });

    return users;
  }

  return {
    fetchUsers,
  }
}

/**
 * Hook allowing to retrieve a list of specific users
 */
export function useGetUsersByIds(ids: string[]) {
  const { token } = useAuthProvider();
  const { privateCall } = useApi();

  return useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      return await privateCall(() => getUsers(token, ids));
    },
    enabled: !!ids,
  });
}

/**
 * Hook allowing to retrieve a specific user
 */
export function useGetUserById(id: Opt<string>) {
  const { token } = useAuthProvider();
  const { privateCall } = useApi();

  return useQuery({
    queryKey: ["users", id],
    queryFn: async () => {
      if (!id) {
        throw new Error('User ID is required to retrieve a specific user');
      }
      return await privateCall(() => getUserById(token, id));
    },
    enabled: !!id,
  });
}