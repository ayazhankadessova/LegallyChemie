import React from 'react';
import '../styles/fridge.css';

const ProductList = ({ products }) => {
    const totalCells = 8; 
    const emptyCells = Array.from({ length: totalCells - products.length }, (_, index) => index);

    return (
        <>
            {products.map((product, index) => (
                <div className="product-cell" key={index}>
                    <img src={product.image} alt={product.name} style={{ width: '100%', borderRadius: '8px' }} />
                </div>
            ))}
            {emptyCells.map((_, index) => (
                <div className="product-cell" key={`empty-${index}`}>
                </div>
            ))}
            <div className="product-cell add-product-cell">
                <button>Add New Product</button>
            </div>
        </>
    );
};


export default ProductList;
