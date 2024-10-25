"use client"; 
import React, { useEffect, useState } from 'react';
import '../styles/landing.css';

export default function Landing() {
  const [name, setName] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const nameFromUrl = params.get('name');

    setName(nameFromUrl || 'there');
  }, []);

  return (
    <div
      className="bg-pink-50 h-screen bg-cover bg-center flex flex-col items-center justify-center"
      style={{ backgroundImage: 'url(/landing.png)' }}
    >
      <h1 className="text-center">
        Hey {name} :)
      </h1>
      <button className="start-button">
        access personal skincare fridge
      </button>
    </div>
  );
}

