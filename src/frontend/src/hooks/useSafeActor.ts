import { useInternetIdentity } from './useInternetIdentity';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { type backendInterface } from '../backend';
import { createActorWithConfig } from '../config';
import { getSecretParameter } from '../utils/urlParams';

const ACTOR_QUERY_KEY = 'actor';

/**
 * Safe actor hook that wraps access-control initialization in try/catch
 * so failures do not break actor availability
 */
export function useSafeActor() {
  const { identity } = useInternetIdentity();
  const queryClient = useQueryClient();
  
  const actorQuery = useQuery<backendInterface>({
    queryKey: [ACTOR_QUERY_KEY, identity?.getPrincipal().toString()],
    queryFn: async () => {
      const isAuthenticated = !!identity;

      if (!isAuthenticated) {
        // Return anonymous actor if not authenticated
        return await createActorWithConfig();
      }

      const actorOptions = {
        agentOptions: {
          identity
        }
      };

      const actor = await createActorWithConfig(actorOptions);
      
      // Wrap access-control initialization in try/catch
      // so failures do not prevent returning a usable actor
      try {
        const adminToken = getSecretParameter('caffeineAdminToken') || '';
        await actor._initializeAccessControlWithSecret(adminToken);
      } catch (error) {
        console.warn('Access control initialization failed, continuing with actor:', error);
        // Continue anyway - actor is still usable for authenticated users
      }
      
      return actor;
    },
    staleTime: Infinity,
    enabled: true,
    retry: false,
  });

  // When the actor changes, invalidate dependent queries
  useEffect(() => {
    if (actorQuery.data) {
      queryClient.invalidateQueries({
        predicate: (query) => {
          return !query.queryKey.includes(ACTOR_QUERY_KEY);
        }
      });
      queryClient.refetchQueries({
        predicate: (query) => {
          return !query.queryKey.includes(ACTOR_QUERY_KEY);
        }
      });
    }
  }, [actorQuery.data, queryClient]);

  return {
    actor: actorQuery.data || null,
    isFetching: actorQuery.isFetching,
    isInitializing: actorQuery.isLoading,
  };
}
