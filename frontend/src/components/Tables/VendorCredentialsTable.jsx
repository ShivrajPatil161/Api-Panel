import React, { useState } from 'react'
import VendorCredentialForm from '../Forms/VendorCredentialForm'

const VendorCredentialTable = () => {
   const [ addModal , setAddModel] = useState(false)


    const handleAddVendorCredentials = () => {
        setAddModel(!addModal)
}

    const handleClose = () => {
        setAddModel(!addModal)
    }
    
  return (
      <div>Vendor Credentials Table 
          <button onClick={handleAddVendorCredentials} className='bg-red-600 p-2 m-4 rounded-2xl text-white'>Add Vendor Credentials </button>


          <VendorCredentialForm
              isOpen={addModal}
              onClose={handleClose}
          />
    </div>
  )
}

export default VendorCredentialTable