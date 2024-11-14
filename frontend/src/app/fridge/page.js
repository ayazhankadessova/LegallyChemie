"use client"; 
import React, { useEffect, useState } from 'react';
import '../styles/fridge.css';
import Nav from '../components/navbar.js';
import ProductList from '../components/product_list.js';
import ProductCard from '../components/product_view.js';
import SearchBar from '../components/searchbar.js';
import IssuesList from '../components/issues_view';

export default function Fridge() {
    //set usestates
    const [day, setDay] = useState('AM');
    const [name, setName] = useState('');
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [showSearchBar, setShowSearchBar] = useState(false);
    const [isThemeChanged, setIsThemeChanged] = useState(false);
    const [loading, setLoading] = useState(true); 
    const [issues, setIssues] = useState([]); 
    const [showIssues, setShowIssues] = useState(false); 
    const [IssuesCount, setIssuesCount] = useState(0);

    const toggleDay = () => {
        const newDay = day === 'AM' ? 'PM' : 'AM';
        setDay(newDay);
        localStorage.setItem('day', newDay);
        getuserProducts(newDay).then(userProducts => {
            if (userProducts) setProducts(userProducts);
        });
        getUserRules(newDay).then(userRules => {
            if (userRules) setRules(userRules);
        });
    };

    // function to fetch user's products
    function getuserProducts(day) {
        return fetch(`http://localhost:8000/${day}/products/`, {
            method: 'GET',
            credentials: 'include' 
        })
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

    function getUserRules(day) {
        return fetch(`http://localhost:8000/${day}/rules/`, {
          method: 'GET',
          credentials: 'include'
        })
          .then(response => {
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            return response.json();
          })
          .then(data => {
            console.log( data); 
            return data;
          })
          .catch(error => {
            console.error('Error fetching rules:', error);
          });
      }

      function removeDuplicates(userRules) {
        const combineTags = (items) => {
          const result = [];
          const map = new Map();
      
          items.forEach(item => {
            const key = `${item.source}-${item.comp}`;
            if (map.has(key)) {
              const existingItem = map.get(key);
              existingItem.rule.tag = [...new Set([...existingItem.rule.tag, item.rule.tag])];
            } else {
              map.set(key, item);
            }
          });
      
          map.forEach(value => result.push(value)); // converting back to array
          return result;
        };
      
        return {
          avoid: combineTags(userRules.avoid),
          usewith: combineTags(userRules.usewith)
        };
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
        setName(nameFromUrl || 'there');
        
        const storedDay = localStorage.getItem('day') || 'AM';
        setDay(storedDay);

        getuserProducts(storedDay)
            .then(userProducts => {
                if (userProducts) {
                    setProducts(userProducts);
                }
            })
            .catch(error => {
                console.error('Error fetching products:', error);
            });
        getUserRules(storedDay)
            .then(userRules => {
                if (userRules && userRules.avoid) {
                    //get userules and set it to combinedissues
                    const combinedIssues = userRules;
                    console.log('combinedIssues:', combinedIssues);
                    const uniqueIssues = removeDuplicates(combinedIssues);
                    console.log('uniqueIssues:', uniqueIssues);
                    setIssues(uniqueIssues);
                    const issuesCount = (uniqueIssues.avoid?.length || 0) + (uniqueIssues.usewith?.length || 0);
                    setIssuesCount(issuesCount);
                    console.log('Issues Count:', issuesCount);
                }
            })
            .catch(error => {
                console.error('Error fetching rules:', error);
            });
        
    }, [day]); 

    if (loading) {
        return <div></div>; 
    }

    const handleCloseIssues = () => {
        setShowIssues(false);
    };
    
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
        fetch(`http://localhost:8000/${day}/products/${productId}/`, {
            method: 'DELETE',
            credentials: 'include'
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to delete product');
            }
            // filtering out the deleted product from the products list
            setProducts(prevProducts => prevProducts.filter(product => product.id !== productId));
            setSelectedProduct(null); // clearing selected product view
            // reload page
            window.location.reload();
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
                    <ProductList 
                        products={products} 
                        onViewProduct={handleViewProduct} 
                        isThemeChanged={isThemeChanged}
                    />
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
                        onProductAdded={(newProduct) => {
                            // updating products list when a new product is added
                            setProducts(prevProducts => [...prevProducts, { name: newProduct }]);
                            setShowSearchBar(false); // hiding search bar after adding
                        }} 
                        day={day}
                    />
                )}
                <ProductCard 
                    selectedProduct={selectedProduct} 
                    onDelete={handleDeleteProduct} 
                    onClose={handleCloseProductCard}
                    isThemeChanged={isThemeChanged} 
                    day={day}
                />
                <button className={`button-issues ${isThemeChanged ? 'dark-theme' : 'light-theme'}`}
                 onClick={() => setShowIssues(true)} 
                 >
                    ⚠️  Issues
                    {IssuesCount > 0 && (
                        <span className="issue-count-badge">{IssuesCount}</span>
                    )}
                </button>
                {showIssues && (
                <IssuesList 
                    issues={issues}
                    onClose={handleCloseIssues} 
                    isThemeChanged={isThemeChanged} 
                />
            )}
            </div>
        </div>
    );
}
