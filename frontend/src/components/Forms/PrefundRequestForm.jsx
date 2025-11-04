import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";

// ✅ Define Zod Schema
const PrefundRequestSchema = z.object({
    mobileNumber: z
        .string()
        .regex(/^[6-9]\d{9}$/, "Invalid mobile number format"),
    depositAmount: z
        .number({ invalid_type_error: "Deposit amount is required" })
        .positive("Deposit amount must be greater than zero"),
    bankHolderName: z
        .string()
        .min(2, "Bank holder name must be at least 2 characters")
        .max(100),
    bankAccountName: z
        .string()
        .min(2, "Bank account name must be at least 2 characters")
        .max(100),
    bankAccountNumber: z
        .string()
        .regex(/^\d{9,18}$/, "Bank account number must be 9–18 digits"),
    bankTranId: z
        .string()
        .min(5, "Bank transaction ID must be at least 5 characters")
        .max(50),
    depositDate: z.string().optional(),
    paymentMode: z.string().optional(),
    depositType: z.string().optional(),
    depositImage: z.string().optional(),
    narration: z.string().max(500, "Narration must not exceed 500 characters").optional(),
});

const PrefundRequestForm = ({ isOpen, onClose, onSubmit, isSubmitting = false }) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm({
        resolver: zodResolver(PrefundRequestSchema),
        defaultValues: {
            mobileNumber: "",
            depositAmount: "",
            bankHolderName: "",
            bankAccountName: "",
            bankAccountNumber: "",
            bankTranId: "",
            depositDate: "",
            paymentMode: "",
            depositType: "",
            depositImage: "",
            narration: "",
        },
    });

    const handleClose = () => {
        reset();
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto relative">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b flex items-center justify-between p-6">
                    <h2 className="text-lg font-semibold text-gray-800">
                        New Prefund Request
                    </h2>
                    <button
                        onClick={handleClose}
                        className="text-gray-500 hover:text-gray-700 transition"
                    >
                        <X size={22} />
                    </button>
                </div>

                {/* Form */}
                <form
                    onSubmit={handleSubmit((data) => {
                        const payload = { ...data, depositAmount: Number(data.depositAmount) };
                        onSubmit(payload, reset, handleClose);
                    })}
                    className="p-6 space-y-8"
                >
                    {/* Section 1: Basic Info */}
                    <section>
                        <h3 className="text-base font-semibold text-gray-700 mb-3">
                            Basic Information
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <FormField
                                label="Mobile Number"
                                required
                                register={register("mobileNumber")}
                                placeholder="Enter 10-digit number"
                                error={errors.mobileNumber?.message}
                            />
                            <FormField
                                label="Deposit Amount"
                                required
                                type="number"
                                register={register("depositAmount", { valueAsNumber: true })}
                                placeholder="Enter deposit amount"
                                error={errors.depositAmount?.message}
                            />
                            <FormField
                                label="Deposit Date"
                                type="date"
                                register={register("depositDate")}
                            />
                            <FormSelect
                                label="Deposit Type"
                                options={["Initial", "Additional", "Refill"]}
                                register={register("depositType")}
                            />
                        </div>
                    </section>

                    {/* Section 2: Bank Details */}
                    <section>
                        <h3 className="text-base font-semibold text-gray-700 mb-3">
                            Bank Details
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <FormField
                                label="Bank Holder Name"
                                required
                                register={register("bankHolderName")}
                                placeholder="Enter holder name"
                                error={errors.bankHolderName?.message}
                            />
                            <FormField
                                label="Bank Account Name"
                                required
                                register={register("bankAccountName")}
                                placeholder="Enter account name"
                                error={errors.bankAccountName?.message}
                            />
                            <FormField
                                label="Account Number"
                                required
                                register={register("bankAccountNumber")}
                                placeholder="Enter 9–18 digits"
                                error={errors.bankAccountNumber?.message}
                            />
                            <FormField
                                label="Transaction ID"
                                required
                                register={register("bankTranId")}
                                placeholder="Enter transaction reference"
                                error={errors.bankTranId?.message}
                            />
                            <FormSelect
                                label="Payment Mode"
                                options={["NEFT", "RTGS", "IMPS", "UPI", "Cash", "Cheque"]}
                                register={register("paymentMode")}
                            />
                        </div>
                    </section>

                    {/* Section 3: Optional Fields */}
                    <section>
                        <h3 className="text-base font-semibold text-gray-700 mb-3">
                            Additional Info
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <FormField
                                label="Deposit Image (URL / Path)"
                                register={register("depositImage")}
                                placeholder="Enter deposit image URL or path"
                            />
                            <FormTextArea
                                label="Narration"
                                register={register("narration")}
                                placeholder="Add notes (optional)"
                                error={errors.narration?.message}
                            />
                        </div>
                    </section>

                    {/* Actions */}
                    <div className="sticky bottom-0 bg-white pt-4 border-t flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition"
                            disabled={isSubmitting}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition disabled:bg-blue-400 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? "Submitting..." : "Submit Request"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PrefundRequestForm;

/* -------------------------- Reusable field components -------------------------- */

const FormField = ({ label, register, placeholder, required, type = "text", error }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
            {label} {required && <span className="text-red-500">*</span>}
        </label>
        <input
            type={type}
            {...register}
            placeholder={placeholder}
            className={`w-full px-3 py-2 border ${error ? "border-red-400" : "border-gray-300"
                } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
        />
        {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
);

const FormSelect = ({ label, register, options }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
        </label>
        <select
            {...register}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
        >
            <option value="">Select {label.toLowerCase()}</option>
            {options.map((opt) => (
                <option key={opt} value={opt}>
                    {opt}
                </option>
            ))}
        </select>
    </div>
);

const FormTextArea = ({ label, register, placeholder, error }) => (
    <div className="col-span-2">
        <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
        </label>
        <textarea
            {...register}
            rows="3"
            placeholder={placeholder}
            className={`w-full px-3 py-2 border ${error ? "border-red-400" : "border-gray-300"
                } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
        />
        {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
);
