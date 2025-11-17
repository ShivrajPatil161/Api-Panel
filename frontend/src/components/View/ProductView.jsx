import { Package, X } from "lucide-react";
import { StatusBadge } from "../Tables/ProductList";



const ProductView = ({ product, onClose }) => {
  if (!product) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Product Details</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Package className="text-blue-500" size={16} />
              <span className="font-medium">Name:</span>
              <span>{product.productName}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="font-medium">Code:</span>
              <span className="font-mono">{product.productCode}</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <span className="font-medium">Category:</span>
              {product.productCategory.categoryName}
            </div>
           
            <div className="flex items-center space-x-2">
              <span className="font-medium">Status:</span>
              <StatusBadge status={product.status} />
                      </div>
                      
                      <div className="flex items-center space-x-2">
                          <span className="font-medium">Has Charges:</span>
                          <span>{product.hasCharges ? "Yes" : "No"}</span>
                      </div>

                      <div className="flex items-center space-x-2">
                          <span className="font-medium">Is Commission:</span>
                          <span>{product.isCommission ? "Yes" : "No"}</span>
                      </div>

                      <div className="flex items-center space-x-2">
                          <span className="font-medium">Transaction Type:</span>
                          <span className="uppercase">{product.transactionType}</span>
                      </div>

                      <div>
                          <div className="flex items-center space-x-2">
                              <span className="font-medium">GST Value:</span>
                              <span>{product.gstValue}%</span>
                          </div>

                          <div className="flex items-center space-x-2">
                              <span className="font-medium">TDS Value:</span>
                              <span>{product.tdsValue}%</span>
                          </div>
                      </div>

            
          </div>

         
          {product.description && (
            <div>
              <span className="font-medium">Description:</span>
              <p className="mt-1 text-gray-700">{product.description}</p>
            </div>
          )}

      

          {product.remarks && (
            <div>
              <span className="font-medium">Remarks:</span>
              <p className="mt-1 text-gray-700">{product.remarks}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductView