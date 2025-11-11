import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { partnerCredentialsApi } from '../../constants/API/partnerCredentialsApi';

const QUERY_KEY = 'partnerCredentials';

// Get all partner credentials
export const usePartnerCredentials = () => {
  return useQuery({
    queryKey: [QUERY_KEY],
    queryFn: partnerCredentialsApi.getAll,
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'Failed to fetch partner credentials');
    }
  });
};

// Get partner credential by ID
export const usePartnerCredential = (id, enabled = true) => {
  return useQuery({
    queryKey: [QUERY_KEY, id],
    queryFn: () => partnerCredentialsApi.getById(id),
    enabled: enabled && !!id,
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'Failed to fetch partner credential');
    }
  });
};

// Create partner credential
export const useCreatePartnerCredential = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: partnerCredentialsApi.create,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY], exact: true });
      toast.success('Partner credential created successfully');
      return data;
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'Failed to create partner credential');
    }
  });
};

// Update partner credential
export const useUpdatePartnerCredential = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => partnerCredentialsApi.update(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY], exact: true });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY, variables.id], exact: true });
      toast.success('Partner credential updated successfully');
      return data;
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'Failed to update partner credential');
    }
  });
};

// Delete partner credential
export const useDeletePartnerCredential = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: partnerCredentialsApi.delete,
    onSuccess: (data, id) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY], exact: true });
      toast.success('Partner credential deleted successfully');
      return data;
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'Failed to delete partner credential');
    }
  });
};