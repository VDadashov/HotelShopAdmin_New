import { useQuery } from '@tanstack/react-query';
import { getData, getOneData } from '../api/requests';
import Cookies from 'js-cookie';
import { ENDPOINTS } from '../constants/Endpoints';

export const useGet = (key, endpoint) => {
  return useQuery({
    queryKey: [key], 
    queryFn: () => getData(endpoint),
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