"use client"; 
import React, { useEffect, useState } from 'react';
import '../styles/fridge.css';
import Nav from '../components/navbar.js';

export default function Fridge() {
    const [name, setName] = useState('');

  
    useEffect(() => {
      const params = new URLSearchParams(window.location.search);
      const nameFromUrl = params.get('name');
  
      setName(nameFromUrl || 'there');
    }, []);
  
    return (
      <div>
      <Nav name={name}></Nav>
      <div className="bg-pink-50 h-screen bg-cover bg-center flex flex-col items-center justify-center">
        
      </div>
      </div>
    );
  }