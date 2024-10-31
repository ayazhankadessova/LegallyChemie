"use client"; 
import React, { useEffect, useState } from 'react';
import '../styles/landing.css';

export default function Landing() {
  const [name, setName] = useState('');
  const [user_id, setID] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const nameFromUrl = params.get('name');
    const user_id = params.get('user_id');
    setName(nameFromUrl || 'there');
    setID(user_id || '0');
  }, []);

  const gotoFridge = () => {
    // go to the fridge page with name parameter
    window.location.href = `http://localhost:3000/fridge?name=${name}&user_id=${user_id}`;
  };

  return (
    <div
      className="bg-pink-50 h-screen bg-cover bg-center flex flex-col items-center justify-center"
      style={{ backgroundImage: 'url(/landing.png)' }}
    >
      <h1 className="text-center">
        Hey {name} :)
      </h1>
      <button className="start-button" onClick={gotoFridge}>
        <img src="/mouse.png" alt="Icon" />
        access personal skincare fridge
      </button>
    </div>
  );
}

