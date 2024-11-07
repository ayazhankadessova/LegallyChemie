"use client"; 
import React, { useEffect, useState } from 'react';
import '../styles/fridge.css';
import Nav from '../components/navbar.js';
import ProductList from '../components/product_list.js';
import ProductCard from '../components/product_view.js';
import SearchBar from '../components/searchbar.js';

export default function Fridge() {
    const [name, setName] = useState('');
    const [user_id, setID] = useState('');
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [showSearchBar, setShowSearchBar] = useState(false);
    const [isThemeChanged, setIsThemeChanged] = useState(false);
    const [loading, setLoading] = useState(true); 

    // function to fetch user's products
    function getuserProducts(user_id) {
        return fetch(`http://localhost:8000/${user_id}/products/`) 
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log(data);
                return data;
            })
            .catch(error => {
                console.error('Error fetching products:', error);
            });
    }

    useEffect(() => {
        const themeFromStorage = localStorage.getItem('theme');
        setTimeout(() => {
          if (themeFromStorage === 'dark') {
            setIsThemeChanged(true);
          } else {
            setIsThemeChanged(false);
          }
          setLoading(false); // setting loading to false after theme is loaded
        }, 100);

        const params = new URLSearchParams(window.location.search);
        const nameFromUrl = params.get('name');
        const idFromUrl = params.get('user_id');
    
        setName(nameFromUrl || 'there');
        setID(idFromUrl || '0');
    
        if (idFromUrl) {
            getuserProducts(idFromUrl)
                .then(userProducts => {
                    if (userProducts) {
                        setProducts(userProducts); 
                    }
                })
                .catch(error => {
                    console.error('Error fetching products:', error);
                });
        }
    }, []); 

    if (loading) {
        return <div></div>; 
      }
    
    const handleViewProduct = (product) => {
        setSelectedProduct(product);
        setShowSearchBar(false);
    };

    const onAddProduct = () => {
      if (!selectedProduct) {
          setShowSearchBar(prev => !prev); 
      }
  };
    
    const handleDeleteProduct = (productId) => {
        fetch(`http://localhost:8000/${user_id}/products/${productId}/`, {
            method: 'DELETE',
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to delete product');
            }
            // filtering out the deleted product from the products list
            setProducts(prevProducts => prevProducts.filter(product => product.id !== productId));
            setSelectedProduct(null); // clearing selected product view
        })
        .catch(error => {
            console.error('Error deleting product:', error);
        });
    };

    const handleCloseProductCard = () => {
      setSelectedProduct(null); 
    };

    return (
        <div 
        className="page" 
        style={{
            backgroundColor: isThemeChanged ? '#D0F7FF' : '#FDEFFB',
            color: isThemeChanged ? '#03045E' : '#000000',  
        }}
    >
            <Nav name={name} banner="SKINCARE FRIDGE" isThemeChanged={isThemeChanged} />
            <div className="left_column">  
                <img 
                    src={isThemeChanged ? "/fridge2.png" : "/fridge.png"} 
                    alt="Fridge" 
                    className="fridge-image"
                />
                <div className="product-grid">
                <div className={`product-cell add-product-cell ${isThemeChanged ? 'theme-dark' : ''}`}>
                <button 
                onClick={onAddProduct} 
                className={`add-product-button ${showSearchBar ? 'close-add-button' : ''}`}
                >
                {showSearchBar ? 'close search bar' : 'add new product'}
                </button>
                </div>
                    <ProductList products={products} onViewProduct={handleViewProduct} isThemeChanged={isThemeChanged} />
                </div>
            </div>
            <div 
                style={{
                    borderLeft: `10px double ${isThemeChanged ? '#00B4D8' : '#FFAADF'}`,
                }}
            />
            <div className="right_column">
                {showSearchBar && ( 
                    <SearchBar 
                        isThemeChanged={isThemeChanged}
                        user_id={user_id} // passing user_id to SearchBar
                        onProductAdded={(newProduct) => {
                            // updating products list when a new product is added
                            setProducts(prevProducts => [...prevProducts, { name: newProduct }]);
                            setShowSearchBar(false); // hiding search bar after adding
                        }} 
                    />
                )}
                <ProductCard 
                    selectedProduct={selectedProduct} 
                    onDelete={handleDeleteProduct} 
                    onClose={handleCloseProductCard}
                    isThemeChanged={isThemeChanged} 
                />
            </div>
      </div>
    );
}
