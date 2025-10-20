import { useQuery } from '@tanstack/react-query';
import { getData, getOneData } from '../api/requests';
import Cookies from 'js-cookie';
import { ENDPOINTS } from '../constants/Endpoints';

export const useGet = (key, endpoint, language = null) => {
  console.log('useGet called with:', { key, endpoint, language });
  return useQuery({
    queryKey: [key, endpoint, language], // Language-i də queryKey-ə əlavə etdik
    queryFn: () => {
      console.log('Fetching data from:', endpoint);
      return getData(endpoint);
    },
    enabled: !!endpoint, // endpoint null deyilsə çağır
    onError: (error) => {
      console.error(`Error fetching data: ${error.message || error}`);
    },
  });
};

export const useGetOne = (key, endpoint, slug) => {
  return useQuery({
    queryKey: [key, slug], 
    queryFn: () => getOneData(endpoint, slug),
    onError: (error) => {
      console.error(`Error fetching data: ${error.message || error}`);
    },
  });
};

// User summary üçün belə istifadə edin:
// const { data: user, isLoading, isError } = useGet('userSummary', ENDPOINTS.getUserSummary);