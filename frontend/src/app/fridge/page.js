"use client"; 
import React, { useEffect, useState } from 'react';
import '../styles/fridge.css';
import Nav from '../components/navbar.js';
import ProductList from '../components/product_list.js';
import ProductCard from '../components/product_view.js';
import SearchBar from '../components/searchbar.js';

export default function Fridge() {
    const [day, setDay] = useState('AM');
    const [name, setName] = useState('');
    const [user_id, setID] = useState('');
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [showSearchBar, setShowSearchBar] = useState(false);
    const [isThemeChanged, setIsThemeChanged] = useState(false);
    const [loading, setLoading] = useState(true); 

    const toggleDay = () => {
        const newDay = day === 'AM' ? 'PM' : 'AM';
        setDay(newDay);
        localStorage.setItem('day', newDay);
        getuserProducts(user_id, newDay).then(userProducts => {
            if (userProducts) setProducts(userProducts);
        });
    };

    // function to fetch user's products
    function getuserProducts(user_id, day) {
        return fetch(`http://localhost:8000/${user_id}/${day}/products/`) 
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
        
        const storedDay = localStorage.getItem('day') || 'AM';
        setDay(storedDay);

        if (idFromUrl) {
            getuserProducts(idFromUrl, storedDay)
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
    
    const handleDeleteProduct = (productId, day) => {
        fetch(`http://localhost:8000/${user_id}/${day}/products/${productId}/`, {
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
        }}>
            <Nav name={name} banner="SKINCARE FRIDGE" isThemeChanged={isThemeChanged} />
            <div className="left_column">  
                <label className={`switch ${isThemeChanged ? 'theme-dark' : ''}`}>
                    <input type="checkbox" checked={day === 'PM'} onChange={toggleDay} />
                    <span 
                        className="slider round"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: day === 'AM' ? 'flex-end' : 'flex-start',
                            padding: '0 12px',
                            color: day === 'AM' ? 'white' : '#FFF',
                            fontWeight: 'bold',
                            transition: 'all 0.4s ease',
                        }}
                    >
                        {day}
                    </span>
                </label>
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
                    <ProductList products={products} 
                    onViewProduct={handleViewProduct} 
                    isThemeChanged={isThemeChanged}/>
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
                        day = {day}
                    />
                )}
                <ProductCard 
                    selectedProduct={selectedProduct} 
                    onDelete={handleDeleteProduct} 
                    onClose={handleCloseProductCard}
                    isThemeChanged={isThemeChanged} 
                    day={day}
                />
            </div>
      </div>
    );
}
