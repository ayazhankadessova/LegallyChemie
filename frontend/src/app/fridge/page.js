"use client"; 
import React, { useEffect, useState } from 'react';
import '../styles/fridge.css';
import Nav from '../components/navbar.js';
import ProductList from '../components/fridge.js';

export default function Fridge() {
    const [name, setName] = useState('');
    const [user_id, setID] = useState('');
    const [products, setProducts] = useState([]);
    
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
      const params = new URLSearchParams(window.location.search);
      const nameFromUrl = params.get('name');
      const idFromUrl = params.get('user_id');
    
      setName(nameFromUrl || 'there');
      setID(idFromUrl || '0');
    
      // fetching products if user_id is present
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
    
    return (
      <div className="page">
      <Nav name={name}></Nav>
      
        <div className="left_column">  
          <img src="/fridge.png" alt="Fridge" className="fridge-image"/>
          <div className="product-grid">
            <ProductList products={products} />
          </div>
          
        </div>
        
        
        <div className="right_column">
        </div>

      </div>
    );
  }