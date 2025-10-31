import React, { useState } from 'react'
import VendorRoutingForm from '../Forms/VendorRoutingForm'

const VendorRoutingTable = () => {
    const [addModal, setAddModel] = useState(false)


    const handleAddVendorRouting = () => {
        setAddModel(!addModal)
    }

    const handleClose = () => {
        setAddModel(!addModal)
    }

    return (
        <div >VendorRoutingTable
            <button onClick={handleAddVendorRouting} className='bg-red-600 p-2 m-4 rounded-2xl text-white'>Add Vendor Routing </button>


            <VendorRoutingForm
                isOpen={addModal}
                onClose={handleClose}
            />
        </div>
    )
}

export default VendorRoutingTable