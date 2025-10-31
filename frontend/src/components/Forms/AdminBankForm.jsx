import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Building2, CreditCard, Hash, DollarSign } from 'lucide-react';

// Import all reusable components from VendorForm
import {
    FormInput,
    FormSelect,
    Modal,
    FormActions,
    FormSection,
    GridLayout,
    StatusToggle
} from './Vendor'; // Adjust the path as needed

const bankSchema = z.object({
    bankName: z.string().min(1, 'Bank name is required'),
    accountNumber: z.string()
        .min(9, 'Account number must be at least 9 digits')
        .max(18, 'Account number must not exceed 18 digits')
        .regex(/^\d+$/, 'Account number must contain only digits'),
    ifscCode: z.string()
        .min(11, 'IFSC code must be 11 characters')
        .max(11, 'IFSC code must be 11 characters')
        .regex(/^[A-Z]{4}0[A-Z0-9]{6}$/, 'Invalid IFSC code format'),
    charges: z.boolean(),
    chargesType: z.string().optional()
}).refine((data) => {
    if (data.charges) {
        return data.chargesType && (data.chargesType === 'percentage' || data.chargesType === 'flat');
    }
    return true;
}, {
    message: 'Charges type is required when charges is enabled',
    path: ['chargesType']
});

const CHARGES_TYPE_OPTIONS = [
    { value: 'percentage', label: 'Percentage' },
    { value: 'flat', label: 'Flat' }
];

const DEFAULT_VALUES = {
    bankName: '',
    accountNumber: '',
    ifscCode: '',
    charges: false,
    chargesType: ''
};

const AdminBankForm = ({ isOpen, onClose, defaultValues = null, onSubmit, isEdit = false }) => {
    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors, isSubmitting }
    } = useForm({
        resolver: zodResolver(bankSchema),
        defaultValues: defaultValues || DEFAULT_VALUES
    });

    const watchCharges = watch('charges');

    const toggleCharges = () => {
        setValue('charges', !watchCharges);
    };

    if (!isOpen) return null;

    return (
        <Modal
            title={isEdit ? 'Edit Bank' : 'Add Bank'}
            subtitle={isEdit ? 'Update bank information' : 'Register a new bank in the system'}
            onClose={onClose}
        >
            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-8">
                {/* Bank Information */}
                <FormSection title="Bank Information" icon={Building2}>
                    <GridLayout>
                        <FormInput
                            label="Bank Name"
                            name="bankName"
                            register={register}
                            error={errors.bankName}
                            required
                            placeholder="Enter bank name"
                        />

                        <FormInput
                            label="Account Number"
                            name="accountNumber"
                            register={register}
                            error={errors.accountNumber}
                            required
                            placeholder="9-18 digits"
                            maxLength={18}
                        />

                        <FormInput
                            label="IFSC Code"
                            name="ifscCode"
                            register={register}
                            error={errors.ifscCode}
                            required
                            placeholder="Enter IFSC code"
                            maxLength={11}
                            style={{ textTransform: 'uppercase' }}
                        />
                    </GridLayout>
                </FormSection>

                {/* Charges Information */}
                <FormSection title="Charges Information" icon={DollarSign}>
                    <GridLayout>
                        <StatusToggle
                            status={watchCharges}
                            onToggle={toggleCharges}
                        />

                        {watchCharges && (
                            <FormSelect
                                label="Charges Type"
                                name="chargesType"
                                register={register}
                                error={errors.chargesType}
                                required
                                options={CHARGES_TYPE_OPTIONS}
                                placeholder="Select charges type"
                            />
                        )}
                    </GridLayout>
                </FormSection>

                {/* Form Actions */}
                <FormActions
                    onCancel={onClose}
                    isSubmitting={isSubmitting}
                    isEdit={isEdit}
                    entityName="Bank"
                />
            </form>
        </Modal>
    );
};

export default AdminBankForm;