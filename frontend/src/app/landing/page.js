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
    <>
      <Nav name={name} banner="HOMEPAGE" isThemeChanged={isThemeChanged}/>
      <div
      className={`h-screen bg-cover bg-center flex flex-col items-center justify-center ${
        isThemeChanged ? 'theme-changed' : ''
      }`}
      style={{
        backgroundImage: isThemeChanged ? 'url(/landing2.png)' : 'url(/landing.png)',
        backgroundColor: isThemeChanged ? '#CAF0F8' : '#FDEFFB',
      }}
    >
        <div className="mt-14 flex flex-col items-center">
          <h1 className="text-center">
            Hey {name} :)
          </h1>
          <button className="start-button" onClick={gotoFridge}>
            <img src={isThemeChanged ? "/mouse2.png" : "/mouse.png"} alt="Icon" />
            access personal skincare fridge
          </button>
        </div>
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
    </>
  );
}
