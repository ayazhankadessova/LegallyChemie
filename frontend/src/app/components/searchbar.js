import React, { useState } from 'react';

const SearchBar = ({ user_id, onProductAdded, isThemeChanged, day }) => {
    const [inputValue, setInputValue] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleAddProduct = (e) => {
        e.preventDefault();
        if (!inputValue) {
            setErrorMessage("Please enter a product name.");
            return;
        }
        
        fetch(`http://localhost:8000/${user_id}/${day}/products/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ user_input: inputValue }), 
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to add product');
            }
            return response.json();
        })
        .then(data => {
            onProductAdded(inputValue); // notifying the parent component that a product was added
            setInputValue(''); // clearing input field
            setErrorMessage(''); // clearing any previous error message
    
            alert('Product added successfully!');
    
            // refreshing the page after the alert is acknowledged by the user
            window.location.reload(); 
        })
        .catch(error => {
            console.error('Error adding product:', error);
            setErrorMessage('This product doesn\'t exist in our database. Sorry! 🙏');
        });
    };
    console.log(isThemeChanged);
    

    return (
        <div className="search-bar">
            <form onSubmit={handleAddProduct}>
            <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="enter product name..."
                className={isThemeChanged ? 'dark-theme' : 'light-theme'}
                style={{
                    border: isThemeChanged ? 'solid 2px #00B4D8' : 'solid 2px #fd76c9',
                    color: isThemeChanged ? '#0077B6' : '#FF5EC1'
                }}
            />
            <button
                className={isThemeChanged ? 'dark-theme' : 'light-theme'} 
                type="submit"
            >
            Add Product
            </button>

            </form>
            {errorMessage && (
            <div
                className="error-message"
                style={{ color: isThemeChanged ? '#03045E' : '#ff0090' }}
            >
                {errorMessage}
            </div>
            )}

            </div>
    );
};

export default SearchBar;
