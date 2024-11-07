import React from 'react';
import '../styles/fridge.css';

const ProductList = ({ products, onViewProduct }) => {
    const totalCells = 8; 
    const emptyCells = Array.from({ length: totalCells - products.length }, (_, index) => index);

    return (
        <>
            {products.map((product, index) => (
                <div className="product-cell" key={index}>
                    <img src={product.image} alt={product.name} className="product-image" />
                    <div className="overlay">
                        <button className="view-btn" onClick={() => onViewProduct(product)}>View</button>
                    </div>
                </div>
            ))}
            {emptyCells.map((_, index) => (
                <div className="product-cell" key={`empty-${index}`}></div>
            ))}
        </>
    );
};

export default ProductList;
