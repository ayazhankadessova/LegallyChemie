
/**
 * @file product_view.js
 * @brief displays a detailed view of a selected product with options to delete or close the view.
 * 
 * @param {Object} selectedProduct - The product object selected by the user.
 * @param {Function} onDelete - Callback function to delete the selected product.
 * @param {Function} onClose - Callback function to close the product view.
 * @param {boolean} isThemeChanged - Boolean indicating if the theme is changed.
 * @param {string} day - The day (AM/PM) associated with the product.
 * 
 * @returns {JSX.Element|null} The rendered product view component or null if no product is selected.
 */

import React from 'react';
import '../styles/fridge.css';


/**
 * @function ProductCard
 * @brief renders a detailed view of the selected product, allowing the user to delete or close it.
 * 
 * @param {Object} props - the component props.
 * @param {Object} props.selectedProduct - the product object selected by the user.
 * @param {Function} props.onDelete - callback function to delete the selected product.
 * @param {Function} props.onClose - callback function to close the product view.
 * @param {boolean} props.isThemeChanged - boolean indicating if the theme is changed.
 * @param {string} props.day - the day (AM/PM) associated with the product.
 * 
 * @returns {JSX.Element|null} the rendered product view component or null if no product is selected.
 */


const ProductCard = ({ selectedProduct, onDelete, onClose, isThemeChanged, day }) => {
    if (!selectedProduct) {
        return null
    }

    /**
     * @function handleDelete
     * @brief Confirms and deletes the selected product from the user's routine.
     */

    const handleDelete = () => {
        const confirmed = window.confirm("Are you sure you want to delete this product?");
        if (confirmed) {
            onDelete(selectedProduct.id, day);
        }
    };

    //log to console the image url of selected product
    // console.log("Selected Product:", selectedProduct);

    return (
        <div className="product-view"
        style={{ backgroundColor: isThemeChanged ? '#00CEF7' : '#FFAADF'}}>
            <button onClick={onClose} className="close-button"
            style={{ backgroundColor: isThemeChanged ?  '#03045E' : '#ff0090'}}>X</button>
            <div className="product-card">
                <h3 className="product-name"
                style={{ color: isThemeChanged ? '#00028E' : '#9c0060'}}>{selectedProduct.name}</h3>
                <div className="image-container">
                    <img src={selectedProduct.image} alt={selectedProduct.name}/>
                </div>
                <p className="product-brand"><strong>Brand:</strong> {selectedProduct.brand}</p>
                <p className="product-description"><strong>Description:</strong> {selectedProduct.description}</p>
                <details className="product-ingredients">
                    <summary><strong>Ingredients:</strong></summary>
                    {selectedProduct.ingredients.join(', ')}
                </details>
                <button 
                onClick={handleDelete} 
                className={`delete-button ${isThemeChanged ? 'theme-dark' : ''}`}
                >
                remove from my routine
                </button>

            </div>
        </div>
    );
};

export default ProductCard;
