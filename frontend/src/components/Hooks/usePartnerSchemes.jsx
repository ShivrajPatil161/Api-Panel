import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { partnerSchemeApi } from '../../constants/API/partnerSchemeApi' 
import { toast } from 'react-toastify'

export const usePartners = () => {
    return useQuery({
        queryKey: ['partners'],
        queryFn: partnerSchemeApi.getPartners,
    
    })
}

export const useProducts = (enabled = true) => {
    return useQuery({
        queryKey: ['products'],
        queryFn: partnerSchemeApi.getProducts,
        enabled,
        
    })
}

export const usePartnersProduct = (apiPartnerId,enabled = false) => {
    return useQuery({
        queryKey: ['partnersProduct', apiPartnerId],
        queryFn: () => partnerSchemeApi.getPartnersProduct(apiPartnerId),
        enabled: enabled && !!apiPartnerId
    })
}


export const useValidSchemes = (productId, categoryName, enabled = false) => {
    return useQuery({
        queryKey: ['validSchemes', productId, categoryName],
        queryFn: () => partnerSchemeApi.getValidSchemes(productId, categoryName),
        enabled: enabled && !!productId && !!categoryName,
        
    })
}

// Mutation hooks
export const useCreateAssignment = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: partnerSchemeApi.createAssignment,
        onSuccess: () => {
            toast.success("Scheme Assigned Successfully")
            queryClient.invalidateQueries({ queryKey: ['partnerSchemes'] })
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message || 'Failed to save assignment. Please try again.')
        }
    })
}

export const useUpdateAssignment = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ id, data }) => partnerSchemeApi.updateAssignment(id, data),
        onSuccess: () => {
            toast.success("Scheme Assignment Successfully Updated")
            queryClient.invalidateQueries({ queryKey: ['partnerSchemes'] })
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message || 'Failed to update assignment. Please try again.')
        }
    })
}