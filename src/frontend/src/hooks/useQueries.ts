import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSafeActor } from './useSafeActor';
import type { UserProfile, HeightMeasurement, HeightPrediction } from '../backend';
import { toast } from 'sonner';

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useSafeActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useSafeActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) {
        throw new Error('Please wait for the connection to be established');
      }
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
      toast.success('Profile saved successfully');
    },
    onError: (error: any) => {
      const message = error.message || 'Failed to save profile';
      toast.error(message);
    },
  });
}

export function useGetGrowthLogs() {
  const { actor, isFetching: actorFetching } = useSafeActor();

  return useQuery<HeightMeasurement[]>({
    queryKey: ['growthLogs'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getGrowthLogsChronological();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useAddGrowthLog() {
  const { actor } = useSafeActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (heightCm: number) => {
      if (!actor) {
        throw new Error('Please wait for the connection to be established');
      }
      return actor.addGrowthLog(heightCm);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['growthLogs'] });
      toast.success('Growth entry added');
    },
    onError: (error: any) => {
      const message = error.message || 'Failed to add entry';
      toast.error(message);
    },
  });
}

export function useUpdateGrowthLog() {
  const { actor } = useSafeActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, newHeight }: { id: bigint; newHeight: number }) => {
      if (!actor) {
        throw new Error('Please wait for the connection to be established');
      }
      return actor.updateGrowthLog(id, newHeight);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['growthLogs'] });
      toast.success('Entry updated');
    },
    onError: (error: any) => {
      const message = error.message || 'Failed to update entry';
      toast.error(message);
    },
  });
}

export function useDeleteGrowthLog() {
  const { actor } = useSafeActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) {
        throw new Error('Please wait for the connection to be established');
      }
      return actor.deleteGrowthLog(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['growthLogs'] });
      toast.success('Entry deleted');
    },
    onError: (error: any) => {
      const message = error.message || 'Failed to delete entry';
      toast.error(message);
    },
  });
}

export function useSavePrediction() {
  const { actor } = useSafeActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (prediction: HeightPrediction) => {
      if (!actor) {
        throw new Error('Please wait for the connection to be established');
      }
      return actor.savePrediction(prediction);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['savedPredictions'] });
    },
    onError: (error: any) => {
      console.error('Failed to save prediction:', error);
    },
  });
}

export function useGetSavedPredictions() {
  const { actor, isFetching: actorFetching } = useSafeActor();

  return useQuery<HeightPrediction | null>({
    queryKey: ['savedPredictions'],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getSavedPredictions();
    },
    enabled: !!actor && !actorFetching,
  });
}
