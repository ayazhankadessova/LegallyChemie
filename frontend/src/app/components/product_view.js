import React from 'react';
import '../styles/fridge.css';

const ProductCard = ({ selectedProduct, onDelete, onClose }) => {
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
        <div className="product-view">
            <button onClick={onClose} className="close-button">X</button>
            <div className="product-card">
                <h3 className="product-name">{selectedProduct.name}</h3>
                <div className="image-container">
                    <img src={selectedProduct.image} alt={selectedProduct.name}/>
                </div>
                <p className="product-brand"><strong>Brand:</strong> {selectedProduct.brand}</p>
                <p className="product-description"><strong>Description:</strong> {selectedProduct.description}</p>
                <p className="product-ingredients">
                    <strong>Ingredients:</strong> {selectedProduct.ingredients.join(', ')}
                </p>
                <button onClick={handleDelete} className="delete-button">remove from my routine</button>
            </div>
        </div>
    );
};

export default ProductCard;
