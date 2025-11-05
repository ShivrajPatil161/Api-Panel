import { AlertTriangle, RefreshCw } from "lucide-react";

const ErrorState = ({
    title = "Something went wrong",
    message = "We couldn’t complete your request. Please try again later.",
    onRetry = null,
    retryLabel = "Retry",
    icon: Icon = AlertTriangle,
}) => {
    return (
        <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
            {/* Icon */}
            <div className="bg-red-100 text-red-600 rounded-full p-4 mb-4">
                <Icon className="w-8 h-8" />
            </div>

            {/* Title */}
            <h2 className="text-lg font-semibold text-gray-800 mb-2">{title}</h2>

            {/* Message */}
            <p className="text-gray-600 max-w-md mb-6">{message}</p>

            {/* Retry Button (Optional) */}
            {onRetry && (
                <button
                    onClick={onRetry}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <RefreshCw className="w-4 h-4" />
                    {retryLabel}
                </button>
            )}
        </div>
    );
};

export default ErrorState;
