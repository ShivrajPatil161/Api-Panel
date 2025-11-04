import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    createPrefundRequest,
    getAllRequests,
    getMyRequests,
    getPendingRequests,
    approveOrRejectRequest,
} from "../../constants/API/prefundApi"; 
import { toast } from "react-toastify";

export const usePrefundQueries = () => {
    const queryClient = useQueryClient();

    // --- User: My Requests ---
    const useMyPrefundRequests = ({ page = 0, size = 10 }) =>
        useQuery({
            queryKey: ["myPrefundRequests", { page, size }],
            queryFn: getMyRequests,
            keepPreviousData: true,
            refetchOnWindowFocus: false,
        });

    // --- Admin: All Requests ---
    const useAllPrefundRequests = ({ page = 0, size = 10 }) =>
        useQuery({
            queryKey: ["allPrefundRequests", { page, size }],
            queryFn: getAllRequests,
            keepPreviousData: true,
            refetchOnWindowFocus: false,
        });

    // --- Admin: Pending Requests ---
    const usePendingPrefundRequests = ({ page = 0, size = 10 }) =>
        useQuery({
            queryKey: ["pendingPrefundRequests", { page, size }],
            queryFn: getPendingRequests,
            keepPreviousData: true,
            refetchOnWindowFocus: false,
        });

    // --- Partner: Create Prefund ---
    const useCreatePrefund = () =>
        useMutation({
            mutationFn: createPrefundRequest,
            onSuccess: () => {
                toast.success("Prefund request created successfully!");
                queryClient.invalidateQueries(["myPrefundRequests"]);
            },
            onError: (error) => {
                toast.error(error.message || "Failed to create request");
            },
        });

    // --- Admin: Approve / Reject ---
    const useApproveRejectPrefund = () =>
        useMutation({
            mutationFn: approveOrRejectRequest,
            onSuccess: () => {
                toast.success("Action processed successfully!");
                queryClient.invalidateQueries(["allPrefundRequests"]);
                queryClient.invalidateQueries(["pendingPrefundRequests"]);
            },
            onError: (error) => {
                toast.error(error.message || "Action failed");
            },
        });

    return {
        useMyPrefundRequests,
        useAllPrefundRequests,
        usePendingPrefundRequests,
        useCreatePrefund,
        useApproveRejectPrefund,
    };
};
