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

    return (
        <div className="product-view">
            <div className="product-card">
                <button onClick={onClose} className="close-button">X</button>
                <h3 className="product-name">{selectedProduct.name}</h3>
                <img src={selectedProduct.image} alt={selectedProduct.name} className="product-image" />
                <p className="product-description"><strong>Description:</strong> {selectedProduct.description}</p>
                <p className="product-ingredients"><strong>Ingredients:</strong> {selectedProduct.ingredients}</p>
                <button onClick={handleDelete} className="delete-button">Delete Product</button>
            </div>
        </div>
    );
};

export default ProductCard;
