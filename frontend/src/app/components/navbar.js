"use client";

import React from 'react';

function Nav({ name }) {
  const handleBack = () => {
    if (typeof window !== 'undefined') { // check if window is defined
      window.history.back(); 
    }
  };

  return (
    <div
      className="fixed top-0 w-full h-13 bg-[#ffbfe7] flex justify-between p-6 px-9 font-roboto text-[#a63b7d] font-custom z-10"
      style={{ boxShadow: '0 4px 10px rgba(167, 59, 125, 0.5)' }}
    >
      <button onClick={handleBack} className="text-[#a63b7d] hover:underline">
        ← Back
      </button>
      <h4 className="uppercase">{name}'s Skincare Fridge</h4>
      <a href="http://localhost:8000/logout">Logout →</a>
    </div>
  );
}

export default Nav;
