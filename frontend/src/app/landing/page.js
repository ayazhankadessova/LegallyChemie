"use client"; 

import React, { useEffect, useState } from 'react';
import '../styles/landing.css';
import Nav from '../components/navbar.js';

export default function Homepage() {
  const [name, setName] = useState('');
  const [user_id, setID] = useState('');
  const [isThemeChanged, setIsThemeChanged] = useState(false);
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const themeFromStorage = localStorage.getItem('theme');
    setTimeout(() => {
      if (themeFromStorage === 'dark') {
        setIsThemeChanged(true);
      } else {
        setIsThemeChanged(false);
      }
      setLoading(false); // setting loading to false after theme is loaded
    }, 100); // 0.1 second delay
    const params = new URLSearchParams(window.location.search);
    const nameFromUrl = params.get('name');
    const user_id = params.get('user_id');
    setName(nameFromUrl || 'there');
    setID(user_id || '0');
  }, []); 

  if (loading) {
    return <div></div>; 
  }

  const gotoFridge = () => {
    window.location.href = `http://localhost:3000/fridge?name=${name}&user_id=${user_id}`;
  };

  const handleChangeTheme = () => {
    const newTheme = !isThemeChanged;
    setIsThemeChanged(newTheme);
    localStorage.setItem('theme', newTheme ? 'dark' : 'light'); // saving theme to localStorage
  };

  return (
    <div 
    className="page"
    style={{
      backgroundColor: isThemeChanged ? '#D0F7FF' : '#FDEFFB',
      color: isThemeChanged ? '#03045E' : '#000000',  
      backgroundImage: isThemeChanged ? 'url(/landing2.png)' : 'url(/landing.png)'
    }}>
      <Nav name={name} banner="HOMEPAGE" isThemeChanged={isThemeChanged} />
      
      <div className="left_column">
        <div className="chemie-container">
        <img 
          src={isThemeChanged ? "/chemie-blue.png" : "/chemie-pink.png"} 
          alt="Icon" 
          className="chemie"
        />
        </div>
      </div>

        <div className="right_column">
            <h1 
              style={{ 
                color: isThemeChanged ? '#F4FDFF' : '#FEF5FF', 
                WebkitTextStroke: isThemeChanged ? '3px navy' : '3px hotpink' 
              }}
            >
              Hey {name} :)
            </h1>
            <button 
            className={`start-button ${isThemeChanged ? 'theme-dark' : ''}`}
            onClick={gotoFridge}>
              <img src={isThemeChanged ? "/mouse2.png" : "/mouse.png"} alt="Icon" />
              access personal skincare fridge
            </button>
          </div>
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
