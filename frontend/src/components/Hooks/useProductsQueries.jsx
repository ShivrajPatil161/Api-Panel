import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
} from "../../constants/API/productApi";

export const useProductQueries = () => {
    const queryClient = useQueryClient();

    // Query for fetching all products with pagination, sorting, and search
    const useAllProducts = (page = 0, size = 10, sortBy = "productName", sortDir = "asc", search = "") => {
        return useQuery({
            queryKey: ["products", { page, size, sortBy, sortDir, search }],
            queryFn: getProducts,
            refetchOnWindowFocus: false,
            staleTime: 5 * 60 * 1000, // 5 minutes
            keepPreviousData: true, // Keep previous data while fetching new page
        });
    };

    // Query for fetching single product by ID
    const useProductById = (id) => {
        return useQuery({
            queryKey: ["product", id],
            queryFn: () => getProductById(id),
            enabled: !!id, // Only run if id exists
            refetchOnWindowFocus: false,
            staleTime: 5 * 60 * 1000,
        });
    };

    // Mutation for creating a product
    const useCreateProduct = () => {
        return useMutation({
            mutationFn: createProduct,
            onSuccess: () => {
                // Invalidate all products queries to refetch data
                queryClient.invalidateQueries({ queryKey: ["products"] });
            },
            onError: (error) => {
                console.error("Create product error:", error);
            },
        });
    };

    // Mutation for updating a product
    const useUpdateProduct = () => {
        return useMutation({
            mutationFn: ({ id, data }) => updateProduct(id, data),
            onSuccess: (data, variables) => {
                // Invalidate products list
                queryClient.invalidateQueries({ queryKey: ["products"] });
                // Invalidate specific product
                queryClient.invalidateQueries({ queryKey: ["product", variables.id] });
            },
            onError: (error) => {
                console.error("Update product error:", error);
            },
        });
    };

    // Mutation for deleting a product
    const useDeleteProduct = () => {
        return useMutation({
            mutationFn: deleteProduct,
            onSuccess: (data, deletedId) => {
                // Invalidate products list
                queryClient.invalidateQueries({ queryKey: ["products"] });
                // Remove specific product from cache
                queryClient.removeQueries({ queryKey: ["product", deletedId] });
            },
            onError: (error) => {
                console.error("Delete product error:", error);
            },
        });
    };

    // Optimistic update mutation for status toggle (optional but useful)
    const useToggleProductStatus = () => {
        return useMutation({
            mutationFn: ({ id, status }) => updateProduct(id, { status }),
            onMutate: async ({ id, status }) => {
                // Cancel outgoing refetches
                await queryClient.cancelQueries({ queryKey: ["products"] });

                // Snapshot previous value
                const previousProducts = queryClient.getQueryData(["products"]);

                // Optimistically update
                queryClient.setQueryData(["products"], (old) => {
                    if (!old) return old;
                    return {
                        ...old,
                        content: old.content.map((product) =>
                            product.id === id ? { ...product, status } : product
                        ),
                    };
                });

                return { previousProducts };
            },
            onError: (err, variables, context) => {
                // Rollback on error
                if (context?.previousProducts) {
                    queryClient.setQueryData(["products"], context.previousProducts);
                }
            },
            onSettled: () => {
                // Always refetch after error or success
                queryClient.invalidateQueries({ queryKey: ["products"] });
            },
        });
    };

    return {
        useAllProducts,
        useProductById,
        useCreateProduct,
        useUpdateProduct,
        useDeleteProduct,
        useToggleProductStatus,
    };
};