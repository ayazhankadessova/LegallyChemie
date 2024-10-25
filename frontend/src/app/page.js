"use client"; // Add this line to make it a client component

import React from 'react';
import './styles/landing.css';

export default function Landing() {
  // Function to handle button click
  const handleLogin = () => {
    window.location.href = "http://localhost:8000/login"; // Redirect to the FastAPI login endpoint
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
