import { useQuery, useQueryClient } from "@tanstack/react-query"
import vendorApi from "../../constants/API/vendorApi";




export const useVendorQueries = () => {
    const queryClient = useQueryClient();


    const useAllVendors = () => {
        return useQuery({
            queryKey: ["vendors"],
            queryFn: vendorApi.getAllVendors
            
        })
    }
    return {
        useAllVendors
    }

}