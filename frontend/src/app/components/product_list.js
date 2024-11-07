import React from 'react';
import '../styles/fridge.css';

const ProductList = ({ products, onViewProduct, isThemeChanged  }) => {
    const totalCells = 8; 
    const emptyCells = Array.from({ length: totalCells - products.length }, (_, index) => index);

    return (
        <>
            {products.map((product, index) => (
                <div className="product-cell" key={index}
                style={{  border: isThemeChanged ? 'solid 2px #00B4D8' : 'solid 2px #fd76c9' }}>

                    <img src={product.image} alt={product.name} className="product-image" />
                    <div className="overlay" 
                    style ={{backgroundColor: isThemeChanged ? 'rgba(173, 216, 230, 0.6)' : 'rgba(255, 0, 144, 0.2)' }}>
                    <button className={`view-btn ${isThemeChanged ? 'theme-dark' : ''}`}
                        onClick={() => onViewProduct(product)}
                    >View
                    </button>
                    </div>
                </div>
            ))}
            {emptyCells.map((_, index) => (
                <div className="product-cell" key={`empty-${index}`}
                style={{  border: isThemeChanged ? 'dashed 2px #00B4D8' : 'dashed 2px #fd76c9' }}></div>
            ))}
        </>
    );
};

export default ProductList;
