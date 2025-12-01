import { useQuery } from '@tanstack/react-query';
import { getData, getOneData } from '../api/requests';

export const useGet = (key, endpoint, language = null) => {
  return useQuery({
    queryKey: [key, endpoint, language], // Language-i də queryKey-ə əlavə etdik
    queryFn: () => {
      return getData(endpoint);
    },
    enabled: !!endpoint, // endpoint null deyilsə çağır
  });
};

export const useGetOne = (key, endpoint, slug) => {
  return useQuery({
    queryKey: [key, slug], 
    queryFn: () => getOneData(endpoint, slug),
  });
};