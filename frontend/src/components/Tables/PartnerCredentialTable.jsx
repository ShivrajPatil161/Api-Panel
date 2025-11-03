import React, { useState } from 'react'
import PartnerCredentialForm from '../Forms/PartnerCredentialForm'

const PartnerCredentialTable = () => {
    const [addModal, setAddModel] = useState(false)


    const handleAddVendorCredentials = () => {
        setAddModel(!addModal)
    }

    const handleClose = () => {
        setAddModel(!addModal)
    }

    return (
        <div>Partner Credentials Table
            <button onClick={handleAddVendorCredentials} className='bg-red-600 p-2 m-4 rounded-2xl text-white'>Add Partner Credentials </button>


            <PartnerCredentialForm
                isOpen={addModal}
                onClose={handleClose}
            />
        </div>
    )
}

export default PartnerCredentialTable