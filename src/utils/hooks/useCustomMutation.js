import { useMutation, useQueryClient } from '@tanstack/react-query';
import { postData, updateData, deleteData, patchData } from '../api/requests';

export const usePost = (key, endpoint) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (newData) => postData(endpoint, newData),
    onSuccess: () => {
      queryClient.invalidateQueries([key]); 
    },
  });
};

export const useUpdate = (key, endpoint, id) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (updatedData) => updateData(endpoint, id, updatedData),
    onSuccess: () => {
      queryClient.invalidateQueries([key]); // array olaraq veriləcək
    },
  });
};

export const useDelete = (key, endpoint, id) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => deleteData(endpoint, id),
    onSuccess: () => {
      queryClient.invalidateQueries([key]); // array olaraq veriləcək
    },
  });
};

export const usePatch = (key, endpoint, id) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (patchedData) => patchData(endpoint, id, patchedData),
    onSuccess: () => {
      queryClient.invalidateQueries([key]);
    },
  });
};