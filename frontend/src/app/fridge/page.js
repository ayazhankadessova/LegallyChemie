"use client"; 
import React, { useEffect, useState } from 'react';
import '../styles/fridge.css';

export default function Fridge() {
    const [name, setName] = useState('');
  
    useEffect(() => {
      const params = new URLSearchParams(window.location.search);
      const nameFromUrl = params.get('name');
  
      setName(nameFromUrl || 'there');
    }, []);
  
    return (
      <div className="bg-pink-50 h-screen bg-cover bg-center flex flex-col items-center justify-center">
        <h1 className="text-center">
          {name}'s Fridge
        </h1>
      </div>
    );
  }