"use client"; 

import React from 'react';
import './styles/index.css';

export default function Landing() {
  const handleLogin = () => {
    window.location.href = "http://localhost:8000/login"; 
  };

  return (
    <div
      className="bg-pink-50 h-screen bg-cover bg-center flex flex-col items-center justify-center"
      style={{ backgroundImage: 'url(/landing.png)' }}
    >
      <h1 className="text-center">
        Welcome!
      </h1>
      <button className="start-button" onClick={handleLogin}>
        <img src="/mouse.png" alt="Icon" />
        click to start
      </button>
    </div>
  );
}
