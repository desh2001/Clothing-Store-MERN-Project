import { Link } from "react-router-dom";

export default function ProductCard({ product }) {
    return (
        <Link
            to={`/overview/${product.productID}`}
            className="group max-w-[300px] w-full bg-white 
                       rounded-2xl shadow-lg overflow-hidden 
                       transform transition-all duration-300 
                       hover:-translate-y-2 hover:shadow-2xl"
        >
            {/* 🖼 Image */}
            <div className="w-full h-[200px] bg-gradient-to-br 
                            from-blue-50 to-white 
                            flex items-center justify-center 
                            relative overflow-hidden">

                <img
                    src={product.images?.[0] || ""}
                    alt={product.name}
                    className="max-h-full object-contain absolute 
                               transition-opacity duration-500 
                               group-hover:opacity-0"
                />

                <img
                    src={product.images?.[1] || product.images?.[0] || ""}
                    alt={product.name}
                    className="max-h-full object-contain absolute 
                               opacity-0 transition-opacity duration-500 
                               group-hover:opacity-100"
                />
            </div>

            {/* 📄 Content */}
            <div className="p-4 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                    <h3 className="text-gray-900 font-semibold text-lg truncate">
                        {product.name}
                    </h3>
                    <span className="text-xs px-2 py-1 rounded-full 
                                     bg-blue-100 text-blue-600">
                        {product.category}
                    </span>
                </div>

                <p className="text-sm text-gray-500 line-clamp-2">
                    {product.description}
                </p>

                {/* 💰 Price */}
                <div className="flex items-center gap-2">
                    {product.labelledPrice > product.price && (
                        <span className="text-sm text-gray-400 line-through">
                            ${product.labelledPrice.toFixed(2)}
                        </span>
                    )}
                    <span className="text-xl font-bold text-blue-600">
                        ${product.price.toFixed(2)}
                    </span>
                </div>

                {/* 🔘 Button */}
                <button
                    className="mt-2 w-full flex items-center justify-center gap-2 
                               bg-gradient-to-r from-blue-600 to-indigo-600 
                               hover:from-blue-700 hover:to-indigo-700 
                               text-white py-2 rounded-lg text-sm 
                               font-medium shadow-md 
                               opacity-0 group-hover:opacity-100 
                               transition-all duration-300"
                >
                    View Product
                </button>
            </div>
        </Link>
    );
}
