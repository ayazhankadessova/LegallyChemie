import React from 'react';
import '../styles/fridge.css';

const ProductCard = ({ selectedProduct, onDelete, onClose, isThemeChanged }) => {
    if (!selectedProduct) {
        return null
    }

    const handleDelete = () => {
        const confirmed = window.confirm("Are you sure you want to delete this product?");
        if (confirmed) {
            onDelete(selectedProduct.id);
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
                <p className="product-ingredients">
                    <strong>Ingredients:</strong> {selectedProduct.ingredients.join(', ')}
                </p>
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
