"use client";

import React, { useEffect, useState } from 'react';

function Nav({ name, banner, isThemeChanged }) {
  const handleBack = () => {
    if (typeof window !== 'undefined') { // check if window is defined
      window.history.back(); 
      
    }
  };

  return (
    <div
      className={`fixed top-0 w-full h-13 flex justify-between p-6 px-9 font-roboto font-custom z-10 ${isThemeChanged ? 'bg-[#00CEF7] text-[#03045E]' : 'bg-[#ffbfe7] text-[#a63b7d]'}`}
      style={{ boxShadow: isThemeChanged ? '0 4px 10px rgba(3, 4, 94, 0.5)' : '0 4px 10px rgba(167, 59, 125, 0.5)' }}
    >
      <button onClick={handleBack} className="hover:underline">
        ← Back
      </button>
      <h4 className="uppercase">{name}'S {banner}</h4>
      <a href="http://localhost:8000/logout">Logout →</a>
    </div>
  );
}

export default Nav;
