// ProductCard Component
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import categoryImages from "../utils/categoryImages";

const ProductCard = ({ product }) => {
    const { addToCart } = useContext(CartContext);

    const handleAddToCart = () => {
        addToCart(
            {
                id: product._id,
                name: product.name,
                price: product.price,
                imageUrl: product.imageUrl,
                category: product.category
            },
            1
        );
        alert('Product added to cart!');
    };

    const finalImage =
        categoryImages[product.category?.toLowerCase()] ||
        product.imageUrl ||
        "https://via.placeholder.com/300";

    return (
        <div className="product-card bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden border border-gray-300">
            <Link to={`/product/${product._id}`}>
                <div className="overflow-hidden h-48 bg-gray-100">
                    <img
                        src={finalImage}
                        alt={product.name}
                        className="w-full h-full object-cover hover:scale-110 transition"
                    />
                </div>
            </Link>

            <div className="p-4">
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                    {product.category}
                </span>

                <Link to={`/product/${product._id}`}>
                    <h3 className="font-bold text-lg mt-2 hover:text-blue-600 transition line-clamp-2">
                        {product.name}
                    </h3>
                </Link>

                <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                    {product.description}
                </p>

                <div className="mt-3">
                    <p className="text-2xl font-bold text-green-600">₹{product.price}</p>
                    <p className="text-xs text-gray-500">
                        {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
                    </p>
                </div>

                <button
                    onClick={handleAddToCart}
                    disabled={product.stock === 0}
                    className={`w-full mt-4 py-2 rounded font-bold transition ${
                        product.stock > 0
                            ? "bg-blue-500 text-white hover:bg-blue-600"
                            : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                >
                    {product.stock > 0 ? "Add to Cart" : "Out of Stock"}
                </button>
            </div>
        </div>
    );
};

export default ProductCard;
