
/**
 * @file product_list.js
 * @brief Displays a list of products and allows users to view individual products.
 * 
 * @param {Array} products - List of product objects to display.
 * @param {Function} onViewProduct - Callback function to view a specific product.
 * @param {boolean} isThemeChanged - Boolean indicating if the theme is changed.
 * 
 * @returns {JSX.Element} The rendered product list component.
 */

import React from 'react';
import '../styles/fridge.css';

/**
 * @function ProductList
 * @brief Renders a grid of product cells, with styles and an overlay based on theme.
 * 
 * @param {Object} props - The component props.
 * @param {Array} props.products - List of product objects to display.
 * @param {Function} props.onViewProduct - Callback function to view a specific product.
 * @param {boolean} props.isThemeChanged - Boolean indicating if the theme is changed.
 * 
 * @returns {JSX.Element} The rendered product list component.
 */

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
                    style={{                            
                        cursor: isThemeChanged ? `url('/select2.png') 2 2, pointer` 
                        : `url('/select1.png') 2 2, pointer`,}}
                    >View
                    </button>
                    </div>
                </div>
            ))}
            {emptyCells.map((_, index) => (
                <div className="product-cell" key={`empty-${index}`}
                style={{  border: isThemeChanged ? 'double 2px #00B4D8' : 'double 2px #fd76c9' }}></div>
            ))}
        </>
    );
};

export default ProductList;
