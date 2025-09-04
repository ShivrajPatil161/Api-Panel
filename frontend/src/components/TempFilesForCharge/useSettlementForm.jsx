// import { useState, useEffect } from 'react';
// import { useForm } from "react-hook-form";
// import api from "../../constants/API/axiosInstance";

// export const useSettlementForm = () => {
//     const { register, watch, handleSubmit, reset, setValue } = useForm({
//         defaultValues: {
//             customerType: "",
//             franchiseId: "",
//             merchantId: "",
//             productId: "",
//             cycle: "",
//             selectedTransactions: []
//         }
//     });

//     const [availableFranchises, setAvailableFranchises] = useState([]);
//     const [availableDirectMerchants, setAvailableDirectMerchants] = useState([]);
//     const [availableFranchiseMerchants, setAvailableFranchiseMerchants] = useState([]);
//     const [availableProducts, setAvailableProducts] = useState([]);
//     const [selectedEntity, setSelectedEntity] = useState(null);
//     const [selectedProduct, setSelectedProduct] = useState(null);
//     const [settlementCandidates, setSettlementCandidates] = useState([]);
//     const [selectAll, setSelectAll] = useState(false);
//     const [loading, setLoading] = useState(false);
//     const [processingBatch, setProcessingBatch] = useState(false);
//     const [creatingBatch, setCreatingBatch] = useState(false);
//     const [currentBatch, setCurrentBatch] = useState(null);
//     const [toast, setToast] = useState(null);

//     const customerType = watch("customerType");
//     const franchiseId = watch("franchiseId");
//     const merchantId = watch("merchantId");
//     const productId = watch("productId");
//     const cycle = watch("cycle");
//     const selectedTransactions = watch("selectedTransactions");

//     const showToast = (message, type = 'success') => {
//         setToast({ message, type });
//     };

//     const hideToast = () => {
//         setToast(null);
//     };

//     // Fetch initial data
//     useEffect(() => {
//         const fetchInitialData = async () => {
//             setLoading(true);
//             try {
//                 const [franchisesResponse, directMerchantsResponse] = await Promise.all([
//                     api.get("/franchise"),
//                     api.get("/merchants/direct-merchant")
//                 ]);

//                 setAvailableFranchises(franchisesResponse.data);
//                 setAvailableDirectMerchants(directMerchantsResponse.data);
//             } catch (error) {
//                 console.error("Error fetching initial data:", error);
//                 showToast("Failed to load initial data", "error");
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchInitialData();
//     }, []);

//     // Reset form when customer type changes
//     useEffect(() => {
//         if (customerType) {
//             setValue("franchiseId", "");
//             setValue("merchantId", "");
//             setValue("productId", "");
//             setValue("cycle", "");
//             setValue("selectedTransactions", []);
//             setAvailableFranchiseMerchants([]);
//             setAvailableProducts([]);
//             setSelectedEntity(null);
//             setSelectedProduct(null);
//             setSettlementCandidates([]);
//             setCurrentBatch(null);
//             setSelectAll(false);
//         }
//     }, [customerType, setValue]);

//     // Fetch franchise merchants when franchise is selected
//     useEffect(() => {
//         const fetchFranchiseMerchants = async () => {
//             if (!franchiseId || customerType !== "franchise") return;

//             setLoading(true);
//             try {
//                 const response = await api.get(`/merchants/franchise/${franchiseId}`);
//                 setAvailableFranchiseMerchants(response.data);

//                 const franchise = availableFranchises.find(f => f.id === parseInt(franchiseId));
//                 setSelectedEntity(franchise);
//             } catch (error) {
//                 console.error("Error fetching franchise merchants:", error);
//                 setAvailableFranchiseMerchants([]);
//                 showToast("Failed to load franchise merchants", "error");
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchFranchiseMerchants();
//     }, [franchiseId, customerType, availableFranchises]);

//     // Set selected entity for direct merchant
//     useEffect(() => {
//         if (customerType === "direct" && merchantId) {
//             const merchant = availableDirectMerchants.find(m => m.id === parseInt(merchantId));
//             setSelectedEntity(merchant);
//         }
//     }, [merchantId, customerType, availableDirectMerchants]);

//     // Fetch products when merchant is selected
//     useEffect(() => {
//         const fetchProducts = async () => {
//             if (!merchantId) {
//                 setAvailableProducts([]);
//                 return;
//             }

//             setLoading(true);
//             try {
//                 let response;
//                 if (customerType === "franchise") {
//                     response = await api.get(`/franchise/products/${franchiseId}`);
//                 } else {
//                     response = await api.get(`/merchants/products/${merchantId}`);
//                 }

//                 setAvailableProducts(response.data);
//             } catch (error) {
//                 console.error("Error fetching products:", error);
//                 setAvailableProducts([]);
//                 showToast("Failed to load products", "error");
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchProducts();
//     }, [merchantId, customerType, franchiseId]);

//     // Set selected product
//     useEffect(() => {
//         if (productId) {
//             const product = availableProducts.find(p => p.productId === parseInt(productId));
//             setSelectedProduct(product);
//         }
//     }, [productId, availableProducts]);

//     const createBatch = async () => {
//         if (!merchantId || !productId || !cycle) {
//             showToast("Please select merchant, product, and cycle first", "error");
//             return;
//         }

//         setCreatingBatch(true);
//         try {
//             const batchResponse = await api.post(
//                 `/merchants/${merchantId}/settlement/batches?cycleKey=${cycle}&createdBy=admin&productId=${productId}`
//             );

//             const batchList = batchResponse.data;
//             const batch = Array.isArray(batchList) ? batchList[0] : batchList;
//             setCurrentBatch(batch);

//             const candidatesResponse = await api.get(
//                 `/merchants/${merchantId}/settlement/batches/${batch.batchId}/candidates`
//             );

//             setSettlementCandidates(candidatesResponse.data);
//             setValue("selectedTransactions", []);
//             setSelectAll(false);

//             showToast(`Batch created successfully! Found ${candidatesResponse.data.length} candidates`);

//         } catch (error) {
//             console.error("Error creating batch:", error);
//             showToast(error.response?.data?.message || "Failed to create batch", "error");
//             setCurrentBatch(null);
//             setSettlementCandidates([]);
//         } finally {
//             setCreatingBatch(false);
//         }
//     };

//     const handleSelectAll = () => {
//         const newSelectAll = !selectAll;
//         setSelectAll(newSelectAll);

//         if (newSelectAll) {
//             const allCandidateIds = settlementCandidates.map(t => t.transactionReferenceId);
//             setValue("selectedTransactions", allCandidateIds);
//         } else {
//             setValue("selectedTransactions", []);
//         }
//     };

//     const handleTransactionToggle = (transactionReferenceId) => {
//         const currentSelected = selectedTransactions || [];
//         const newSelected = currentSelected.includes(transactionReferenceId)
//             ? currentSelected.filter(id => id !== transactionReferenceId)
//             : [...currentSelected, transactionReferenceId];

//         setValue("selectedTransactions", newSelected);
//         setSelectAll(newSelected.length === settlementCandidates.length);
//     };

//     const onSubmit = async (data) => {
//         if (!data.selectedTransactions?.length) {
//             showToast("Please select at least one transaction to settle", "error");
//             return;
//         }

//         if (!currentBatch) {
//             showToast("No active batch found. Please create a batch first", "error");
//             return;
//         }

//         setProcessingBatch(true);

//         try {
//             const settleResponse = await api.post(
//                 `/merchants/${merchantId}/settlement/batches/${currentBatch.batchId}/candidates`,
//                 { vendorTxIds: data.selectedTransactions }
//             );
// console.log(settleResponse)
//             showToast(`Successfully settled ${data.selectedTransactions.length} transactions!`);
//             resetForm();

//         } catch (error) {
//             console.error("Error processing settlement:", error);
//             showToast(error.response?.data?.message || "Failed to process settlement", "error");
//         } finally {
//             setProcessingBatch(false);
//         }
//     };

//     const resetForm = () => {
//         reset();
//         setSelectedEntity(null);
//         setSelectedProduct(null);
//         setAvailableFranchiseMerchants([]);
//         setAvailableProducts([]);
//         setSettlementCandidates([]);
//         setSelectAll(false);
//         setCurrentBatch(null);
//     };

//     const calculateTotals = () => {
//         const selectedCandidates = settlementCandidates.filter(
//             t => selectedTransactions?.includes(t.transactionReferenceId)
//         );

//         const totalAmount = selectedCandidates.reduce((sum, t) => sum + (t.amount || 0), 0);
//         const totalFee = selectedCandidates.reduce((sum, t) => sum + (t.fee || 0), 0);
//         const totalNet = selectedCandidates.reduce((sum, t) => sum + (t.netAmount || 0), 0);

//         return {
//             totalAmount,
//             totalFee,
//             totalNet,
//             count: selectedCandidates.length
//         };
//     };

//     const canCreateBatch = merchantId && productId && cycle && !currentBatch;

//     return {
//         // Form controls
//         register,
//         handleSubmit,
//         reset,
//         setValue,

//         // Form values
//         customerType,
//         franchiseId,
//         merchantId,
//         productId,
//         cycle,
//         selectedTransactions,

//         // Data states
//         availableFranchises,
//         availableDirectMerchants,
//         availableFranchiseMerchants,
//         availableProducts,
//         selectedEntity,
//         selectedProduct,
//         settlementCandidates,
//         currentBatch,

//         // UI states
//         selectAll,
//         loading,
//         processingBatch,
//         creatingBatch,
//         toast,

//         // Computed values
//         canCreateBatch,
//         totals: calculateTotals(),

//         // Actions
//         showToast,
//         hideToast,
//         createBatch,
//         handleSelectAll,
//         handleTransactionToggle,
//         onSubmit,
//         resetForm
//     };
// };










import { useState, useEffect } from 'react';
import { useForm } from "react-hook-form";
import api from "../../constants/API/axiosInstance";

export const useSettlementForm = () => {
    const { register, watch, handleSubmit, reset, setValue } = useForm({
        defaultValues: {
            customerType: "",
            franchiseId: "",
            merchantId: "",
            productId: "",
            cycle: "",
            selectedTransactions: [],
            selectedMerchants: [], // For franchise batch creation
            batchType: "selective" // "selective" or "full"
        }
    });

    const [availableFranchises, setAvailableFranchises] = useState([]);
    const [availableDirectMerchants, setAvailableDirectMerchants] = useState([]);
    const [availableFranchiseMerchants, setAvailableFranchiseMerchants] = useState([]);
    const [availableProducts, setAvailableProducts] = useState([]);
    const [selectedEntity, setSelectedEntity] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [settlementCandidates, setSettlementCandidates] = useState([]);
    const [selectAll, setSelectAll] = useState(false);
    const [loading, setLoading] = useState(false);
    const [processingBatch, setProcessingBatch] = useState(false);
    const [creatingBatch, setCreatingBatch] = useState(false);
    const [currentBatch, setCurrentBatch] = useState(null);
    const [currentFranchiseBatch, setCurrentFranchiseBatch] = useState(null);
    const [selectedMerchantForCandidates, setSelectedMerchantForCandidates] = useState(null);
    const [toast, setToast] = useState(null);

    const customerType = watch("customerType");
    const franchiseId = watch("franchiseId");
    const merchantId = watch("merchantId");
    const productId = watch("productId");
    const cycle = watch("cycle");
    const selectedTransactions = watch("selectedTransactions");
    const selectedMerchants = watch("selectedMerchants");
    const batchType = watch("batchType");

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
    };

    const hideToast = () => {
        setToast(null);
    };

    // Fetch initial data
    useEffect(() => {
        const fetchInitialData = async () => {
            setLoading(true);
            try {
                const [franchisesResponse, directMerchantsResponse] = await Promise.all([
                    api.get("/franchise"),
                    api.get("/merchants/direct-merchant")
                ]);

                setAvailableFranchises(franchisesResponse.data);
                setAvailableDirectMerchants(directMerchantsResponse.data);
            } catch (error) {
                console.error("Error fetching initial data:", error);
                showToast("Failed to load initial data", "error");
            } finally {
                setLoading(false);
            }
        };

        fetchInitialData();
    }, []);

    // Reset form when customer type changes
    useEffect(() => {
        if (customerType) {
            setValue("franchiseId", "");
            setValue("merchantId", "");
            setValue("productId", "");
            setValue("cycle", "");
            setValue("selectedTransactions", []);
            setValue("selectedMerchants", []);
            setAvailableFranchiseMerchants([]);
            setAvailableProducts([]);
            setSelectedEntity(null);
            setSelectedProduct(null);
            setSettlementCandidates([]);
            setCurrentBatch(null);
            setCurrentFranchiseBatch(null);
            setSelectedMerchantForCandidates(null);
            setSelectAll(false);
        }
    }, [customerType, setValue]);

    // Fetch products when franchise is selected (for franchise type)
    useEffect(() => {
        const fetchFranchiseProducts = async () => {
            if (!franchiseId || customerType !== "franchise") return;

            setLoading(true);
            try {
                const response = await api.get(`/franchise/products/${franchiseId}`);
                setAvailableProducts(response.data);

                const franchise = availableFranchises.find(f => f.id === parseInt(franchiseId));
                setSelectedEntity(franchise);
            } catch (error) {
                console.error("Error fetching franchise products:", error);
                setAvailableProducts([]);
                showToast("Failed to load franchise products", "error");
            } finally {
                setLoading(false);
            }
        };

        fetchFranchiseProducts();
    }, [franchiseId, customerType, availableFranchises]);

    // Fetch merchants when franchise and product are selected
    useEffect(() => {
        const fetchFranchiseMerchants = async () => {
            if (!franchiseId || !productId || customerType !== "franchise" || !cycle) return;

            setLoading(true);
            try {
                const response = await api.get(
                    `/franchises/${franchiseId}/bulk-settlement/merchants/available?cycleKey=${cycle}`
                );
                setAvailableFranchiseMerchants(response.data);
            } catch (error) {
                console.error("Error fetching franchise merchants:", error);
                setAvailableFranchiseMerchants([]);
                showToast("Failed to load franchise merchants", "error");
            } finally {
                setLoading(false);
            }
        };

        fetchFranchiseMerchants();
    }, [franchiseId, productId, cycle, customerType]);

    // Set selected entity for direct merchant
    useEffect(() => {
        if (customerType === "direct" && merchantId) {
            const merchant = availableDirectMerchants.find(m => m.id === parseInt(merchantId));
            setSelectedEntity(merchant);
        }
    }, [merchantId, customerType, availableDirectMerchants]);

    // Fetch products when direct merchant is selected
    useEffect(() => {
        const fetchDirectMerchantProducts = async () => {
            if (!merchantId || customerType !== "direct") {
                setAvailableProducts([]);
                return;
            }

            setLoading(true);
            try {
                const response = await api.get(`/merchants/products/${merchantId}`);
                setAvailableProducts(response.data);
            } catch (error) {
                console.error("Error fetching products:", error);
                setAvailableProducts([]);
                showToast("Failed to load products", "error");
            } finally {
                setLoading(false);
            }
        };

        fetchDirectMerchantProducts();
    }, [merchantId, customerType]);

    // Set selected product
    useEffect(() => {
        if (productId) {
            const product = availableProducts.find(p => p.productId === parseInt(productId));
            setSelectedProduct(product);
        }
    }, [productId, availableProducts]);

    // Create batch for direct merchant
    const createDirectMerchantBatch = async () => {
        if (!merchantId || !productId || !cycle) {
            showToast("Please select merchant, product, and cycle first", "error");
            return;
        }

        setCreatingBatch(true);
        try {
            const batchResponse = await api.post(
                `/merchants/${merchantId}/settlement/batches?cycleKey=${cycle}&createdBy=admin&productId=${productId}`
            );

            const batchList = batchResponse.data;
            const batch = Array.isArray(batchList) ? batchList[0] : batchList;
            setCurrentBatch(batch);

            const candidatesResponse = await api.get(
                `/merchants/${merchantId}/settlement/batches/${batch.batchId}/candidates`
            );

            setSettlementCandidates(candidatesResponse.data);
            setValue("selectedTransactions", []);
            setSelectAll(false);

            showToast(`Batch created successfully! Found ${candidatesResponse.data.length} candidates`);

        } catch (error) {
            console.error("Error creating batch:", error);
            showToast(error.response?.data?.message || "Failed to create batch", "error");
            setCurrentBatch(null);
            setSettlementCandidates([]);
        } finally {
            setCreatingBatch(false);
        }
    };

    // Create batch for franchise
    const createFranchiseBatch = async () => {
        if (!franchiseId || !cycle) {
            showToast("Please select franchise and cycle first", "error");
            return;
        }

        if (batchType === "selective" && !selectedMerchants.length) {
            showToast("Please select at least one merchant for selective batch", "error");
            return;
        }

        setCreatingBatch(true);
        try {
            let batchResponse;
            if (batchType === "full") {
                batchResponse = await api.post(
                    `/franchises/${franchiseId}/bulk-settlement/batches/full?cycleKey=${cycle}&createdBy=admin`
                );
            } else {
                batchResponse = await api.post(
                    `/franchises/${franchiseId}/bulk-settlement/batches/selective?cycleKey=${cycle}&createdBy=admin`,
                    selectedMerchants
                );
            }

            setCurrentFranchiseBatch(batchResponse.data);
            showToast(`Franchise batch created successfully!`);

        } catch (error) {
            console.error("Error creating franchise batch:", error);
            showToast(error.response?.data?.message || "Failed to create franchise batch", "error");
            setCurrentFranchiseBatch(null);
        } finally {
            setCreatingBatch(false);
        }
    };

    // Load candidates for selected merchant in franchise batch
    const loadMerchantCandidates = async (merchantIdToLoad) => {
        if (!currentFranchiseBatch || !franchiseId || !cycle) {
            showToast("No active franchise batch found", "error");
            return;
        }

        setLoading(true);
        try {
            const response = await api.get(
                `/franchises/${franchiseId}/bulk-settlement/batches/${currentFranchiseBatch.batchId}/merchants/${merchantIdToLoad}/candidates?cycleKey=${cycle}`
            );

            setSettlementCandidates(response.data);
            setSelectedMerchantForCandidates(merchantIdToLoad);
            setValue("selectedTransactions", []);
            setSelectAll(false);

            showToast(`Found ${response.data.length} candidates for selected merchant`);

        } catch (error) {
            console.error("Error loading merchant candidates:", error);
            showToast("Failed to load merchant candidates", "error");
            setSettlementCandidates([]);
            setSelectedMerchantForCandidates(null);
        } finally {
            setLoading(false);
        }
    };

    const createBatch = async () => {
        if (customerType === "direct") {
            await createDirectMerchantBatch();
        } else if (customerType === "franchise") {
            await createFranchiseBatch();
        }
    };

    const handleSelectAll = () => {
        const newSelectAll = !selectAll;
        setSelectAll(newSelectAll);

        if (newSelectAll) {
            const allCandidateIds = settlementCandidates.map(t => t.transactionReferenceId);
            setValue("selectedTransactions", allCandidateIds);
        } else {
            setValue("selectedTransactions", []);
        }
    };

    const handleTransactionToggle = (transactionReferenceId) => {
        const currentSelected = selectedTransactions || [];
        const newSelected = currentSelected.includes(transactionReferenceId)
            ? currentSelected.filter(id => id !== transactionReferenceId)
            : [...currentSelected, transactionReferenceId];

        setValue("selectedTransactions", newSelected);
        setSelectAll(newSelected.length === settlementCandidates.length);
    };

    const handleMerchantToggle = (merchantIdToToggle) => {
        const currentSelected = selectedMerchants || [];
        const newSelected = currentSelected.includes(merchantIdToToggle)
            ? currentSelected.filter(id => id !== merchantIdToToggle)
            : [...currentSelected, merchantIdToToggle];

        setValue("selectedMerchants", newSelected);
    };

    const onSubmit = async (data) => {
        if (customerType === "direct") {
            return await submitDirectMerchantSettlement(data);
        } else if (customerType === "franchise") {
            return await submitFranchiseSettlement(data);
        }
    };

    const submitDirectMerchantSettlement = async (data) => {
        if (!data.selectedTransactions?.length) {
            showToast("Please select at least one transaction to settle", "error");
            return;
        }

        if (!currentBatch) {
            showToast("No active batch found. Please create a batch first", "error");
            return;
        }

        setProcessingBatch(true);

        try {
            const settleResponse = await api.post(
                `/merchants/${merchantId}/settlement/batches/${currentBatch.batchId}/candidates`,
                { vendorTxIds: data.selectedTransactions }
            );

            showToast(`Successfully settled ${data.selectedTransactions.length} transactions!`);
            resetForm();

        } catch (error) {
            console.error("Error processing settlement:", error);
            showToast(error.response?.data?.message || "Failed to process settlement", "error");
        } finally {
            setProcessingBatch(false);
        }
    };

    const submitFranchiseSettlement = async (data) => {
        if (!currentFranchiseBatch) {
            showToast("No active franchise batch found", "error");
            return;
        }

        if (!selectedMerchantForCandidates || !data.selectedTransactions?.length) {
            showToast("Please select a merchant and transactions to settle", "error");
            return;
        }

        setProcessingBatch(true);

        try {
            // Update merchant candidates first
            await api.put(
                `/franchises/${franchiseId}/bulk-settlement/batches/${currentFranchiseBatch.batchId}/merchants/${selectedMerchantForCandidates}/candidates`,
                data.selectedTransactions
            );

            // Then process the batch
            await api.post(
                `/franchises/${franchiseId}/bulk-settlement/batches/${currentFranchiseBatch.batchId}/process`
            );

            showToast(`Successfully initiated franchise settlement for ${data.selectedTransactions.length} transactions!`);
            resetForm();

        } catch (error) {
            console.error("Error processing franchise settlement:", error);
            showToast(error.response?.data?.message || "Failed to process franchise settlement", "error");
        } finally {
            setProcessingBatch(false);
        }
    };

    const resetForm = () => {
        reset();
        setSelectedEntity(null);
        setSelectedProduct(null);
        setAvailableFranchiseMerchants([]);
        setAvailableProducts([]);
        setSettlementCandidates([]);
        setSelectAll(false);
        setCurrentBatch(null);
        setCurrentFranchiseBatch(null);
        setSelectedMerchantForCandidates(null);
    };

    const calculateTotals = () => {
        const selectedCandidates = settlementCandidates.filter(
            t => selectedTransactions?.includes(t.transactionReferenceId)
        );

        const totalAmount = selectedCandidates.reduce((sum, t) => sum + (t.amount || 0), 0);
        const totalFee = selectedCandidates.reduce((sum, t) => sum + (t.fee || 0), 0);
        const totalNet = selectedCandidates.reduce((sum, t) => sum + (t.netAmount || 0), 0);

        return {
            totalAmount,
            totalFee,
            totalNet,
            count: selectedCandidates.length
        };
    };

    const canCreateBatch = () => {
        if (customerType === "direct") {
            return merchantId && productId && cycle && !currentBatch;
        } else if (customerType === "franchise") {
            return franchiseId && productId && cycle && !currentFranchiseBatch &&
                (batchType === "full" || (batchType === "selective" && selectedMerchants.length > 0));
        }
        return false;
    };

    const canLoadCandidates = customerType === "franchise" && currentFranchiseBatch && availableFranchiseMerchants.length > 0;

    return {
        // Form controls
        register,
        handleSubmit,
        reset,
        setValue,

        // Form values
        customerType,
        franchiseId,
        merchantId,
        productId,
        cycle,
        selectedTransactions,
        selectedMerchants,
        batchType,

        // Data states
        availableFranchises,
        availableDirectMerchants,
        availableFranchiseMerchants,
        availableProducts,
        selectedEntity,
        selectedProduct,
        settlementCandidates,
        currentBatch,
        currentFranchiseBatch,
        selectedMerchantForCandidates,

        // UI states
        selectAll,
        loading,
        processingBatch,
        creatingBatch,
        toast,

        // Computed values
        canCreateBatch: canCreateBatch(),
        canLoadCandidates,
        totals: calculateTotals(),

        // Actions
        showToast,
        hideToast,
        createBatch,
        loadMerchantCandidates,
        handleSelectAll,
        handleTransactionToggle,
        handleMerchantToggle,
        onSubmit,
        resetForm
    };
};