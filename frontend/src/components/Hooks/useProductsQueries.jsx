import { useQuery, useQueryClient } from "@tanstack/react-query"
import { getProducts } from "../../constants/API/productApi";



export const useProductsQueries = () => {
    const queryClient = useQueryClient();

    const useAllProducts = () => {
        return useQuery({
            queryKey: ["getAllProducts", { page: 0, size: 10, sortBy: "productName", sortDir: "asc", search: "" }],
            queryFn: getProducts,
            refetchOnWindowFocus: false,
            staleTime: 5 * 60 * 1000
        })
    }

    return {
        useAllProducts
    }
}
