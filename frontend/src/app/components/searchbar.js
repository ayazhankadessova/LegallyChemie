
/**
 * @file searchbar.js
 * @brief search bar component that allows users to input a product name and add it to their routine.
 * 
 * @param {Function} onProductAdded - callback function to notify the parent component when a product is added.
 * @param {boolean} isThemeChanged - boolean indicating if the theme is changed.
 * @param {string} day - the day (AM/PM) associated with the product.
 * 
 * @returns {JSX.Element} the rendered search bar component.
 */

import React, { useState } from 'react';

/**
 * @function SearchBar
 * @brief tenders a search bar that allows users to enter a product name and add it to their routine.
 * 
 * @param {Object} props - the component props.
 * @param {Function} props.onProductAdded - callback function to notify the parent component when a product is added.
 * @param {boolean} props.isThemeChanged - boolean indicating if the theme is changed.
 * @param {string} props.day - the day (AM/PM) associated with the product.
 * 
 * @returns {JSX.Element} the rendered search bar component.
 */

import config from "../config.js";

const apiUrl = config.apiUrl; 
const frontendUrl = config.frontendUrl;

const SearchBar = ({ onProductAdded, isThemeChanged, day }) => {
    const [inputValue, setInputValue] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    /**
     * @function handleAddProduct
     * @brief handles the addition of a product to the user's routine by sending a POST request.
     * 
     * @param {Object} e - the event object from the form submission.
     */

    const handleAddProduct = (e) => {
        e.preventDefault();
        if (!inputValue) {
            setErrorMessage("Please enter a product name.");
            return;
        }
        
        fetch(apiUrl + `/${day}/products/`, {
            method: 'POST',
            credentials: 'include',
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
            if (data.message === "Product already in user's products list") {
                setErrorMessage('You already have this product in your routine 😭');
            }
            else{
                onProductAdded(inputValue); // notifying the parent component that a product was added
                setInputValue(''); // clearing input field
                setErrorMessage(''); // clearing any previous error message
        
                alert('Product added successfully!');
        
                // refreshing the page after the alert is acknowledged by the user
                window.location.reload(); 
            }
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
                style={{                            
                    cursor: isThemeChanged 
                    ? `url('/select2.png') 2 2, pointer` 
                    : `url('/select1.png') 2 2, pointer`,}} 
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
