import React from 'react';
import '../styles/fridge.css';

const ProductList = ({ products, onViewProduct }) => {
    const totalCells = 8; 
    const emptyCells = Array.from({ length: totalCells - products.length }, (_, index) => index);

    return (
        <>
            {products.map((product, index) => (
                <div className="product-cell" key={index}>
                    <img src={product.image} alt={product.name}/>
                    <button className="view-btn" onClick={() => onViewProduct(product)}>View</button>
                </div>
            ))}
            {emptyCells.map((_, index) => (
                <div className="product-cell" key={`empty-${index}`}></div>
            ))}
        </>
    );
};

export default ProductList;
