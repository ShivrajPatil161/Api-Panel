import React, { useState } from 'react'
import AdminBankForm from '../Forms/AdminBankForm'

const AdminBankTable = () => {

    const [addModal, setAddModel] = useState(false)


    const handleAddBank = () => {
        setAddModel(!addModal)
    }

    const handleClose = () => {
        setAddModel(!addModal)
    }

    return (
        <div>AdminBankTable
            <button onClick={handleAddBank} className='bg-red-600 p-2 m-4 rounded-2xl text-white'>Add Bank </button>


            <AdminBankForm
                isOpen={addModal}
                onClose={handleClose}
            />
        </div>
    )
}


export default AdminBankTable