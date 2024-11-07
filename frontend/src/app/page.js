"use client"; 

import React, { useState, useEffect } from 'react';
import './styles/index.css';

export default function Landing() {
  const [isThemeChanged, setIsThemeChanged] = useState(false);
  const [loading, setLoading] = useState(true); 

  // loading theme from localStorage on component mount
  useEffect(() => {
    const themeFromStorage = localStorage.getItem('theme');
    setTimeout(() => {
      if (themeFromStorage === 'dark') {
        setIsThemeChanged(true);
      } else {
        setIsThemeChanged(false);
      }
      setLoading(false); // setting loading to false after theme is loaded
    }, 100)
  }, []);
  
  if (loading) {
    return <div></div>; 
  }

  const handleLogin = () => {
    window.location.href = "http://localhost:8000/login"; 
  };

  const handleChangeTheme = () => {
    const newTheme = !isThemeChanged;
    setIsThemeChanged(newTheme);
    localStorage.setItem('theme', newTheme ? 'dark' : 'light'); // saving theme to localStorage
  };

  return (
    <div
      className={`h-screen bg-cover bg-center flex flex-col items-center justify-center ${
        isThemeChanged ? 'theme-changed' : ''
      }`}
      style={{
        backgroundImage: isThemeChanged ? 'url(/landing2.png)' : 'url(/landing.png)',
        backgroundColor: isThemeChanged ? '#CAF0F8' : '#FDEFFB',
      }}
    >
      <h1 className="text-center">
        Welcome!
      </h1>
      <button className="start-button" onClick={handleLogin}>
        <img src={isThemeChanged ? "/mouse2.png" : "/mouse.png"} alt="Icon" />
        click to start
      </button>
      <button
        onClick={handleChangeTheme}
        style={{
          backgroundColor: isThemeChanged ? '#03045E' : '#AA00FF',
          color: 'white',
          padding: '10px 20px',
          borderRadius: '15px',
          fontSize: '20px',
          fontWeight: 'bold',
          position: 'absolute',
          bottom: '50px',
          right: '50px'
        }}
      >
        change theme
      </button>
    </div>
  );
}
