import { useMutation, useQueryClient } from '@tanstack/react-query';
import { postData, updateData, deleteData, patchData } from '../api/requests';

export const usePost = (key, endpoint) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (newData) => postData(endpoint, newData),
    onSuccess: () => {
      queryClient.invalidateQueries([key]); 
    },
    onError: (error) => {
      console.error(`Error posting data: ${error.message || error}`);
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
    onError: (error) => {
      console.error(`Error updating data: ${error.message || error}`);
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
    onError: (error) => {
      console.error(`Error deleting data: ${error.message || error}`);
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
    onError: (error) => {
      console.error(`Error patching data: ${error.message || error}`);
    },
  });
};