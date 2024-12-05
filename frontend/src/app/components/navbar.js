"use client";
/**
 * @file navbar.js
 * @brief A navigation bar component with a back button, title, and logout link.
 * 
 * @param {string} name - The name to display in the title.
 * @param {string} banner - The banner text to display in the title.
 * @param {boolean} isThemeChanged - Boolean indicating if the theme is changed.
 * 
 * @returns {JSX.Element} The rendered navigation bar component.
 */

import React, { useEffect, useState } from 'react';

import config from "../config.js";

const apiUrl = config.apiUrl; 
const frontendUrl = config.frontendUrl;

/**
 * @function Nav
 * @brief Renders the navigation bar with back and logout functionality.
 * 
 * @param {Object} props - The component props.
 * @param {string} props.name - The name to display in the title.
 * @param {string} props.banner - The banner text to display in the title.
 * @param {boolean} props.isThemeChanged - Boolean indicating if the theme is changed.
 * 
 * @returns {JSX.Element} The rendered navigation bar component.
 */

function Nav({ name, banner, isThemeChanged }) {
  /**
   * @function handleBack
   * @brief Navigates the user back to the previous page.
   */

  const handleBack = () => {
    if (typeof window !== 'undefined') { // check if window is defined
      window.history.back();

    }
  };

  return (
    <div
      className={`fixed top-0 w-full h-13 flex justify-between p-0 font-roboto font-custom z-10 ${isThemeChanged ? 'bg-[#00CEF7] text-[#03045E]' : 'bg-[#ffbfe7] text-[#a63b7d]'}`}
    >
      <button
        onClick={handleBack}
        className={`flex items-center space-x-1 p-3 py-4 transform transition duration-200`}
        style={{
          cursor: isThemeChanged
            ? `url('/select2.png') 2 2, pointer`
            : `url('/select1.png') 2 2, pointer`,
        }}
      >
        <svg
          className="align-bottom"
          xmlns="http://www.w3.org/2000/svg"
          width="1.5em"
          height="1.5em"
          viewBox="0 0 24 24"
        >
          <path
            fill="currentColor"
            d="m4 10l-.707.707L2.586 10l.707-.707zm17 8a1 1 0 1 1-2 0zM8.293 15.707l-5-5l1.414-1.414l5 5zm-5-6.414l5-5l1.414 1.414l-5 5zM4 9h10v2H4zm17 7v2h-2v-2zm-7-7a7 7 0 0 1 7 7h-2a5 5 0 0 0-5-5z"
          />
        </svg>
        <span>back</span>
      </button>

      <h4 className={`h-full p-4 font-semibold text-xl`}
        style={{
        }}>{name}'s <span className='lowercase'>{banner}</span></h4>
      <a
        href={`${apiUrl}/logout`}
        className="flex items-center space-x-1 p-3 py-4 transform transition duration-200"
        style={{
          cursor: isThemeChanged
            ? `url('/select2.png') 2 2, pointer`
            : `url('/select1.png') 2 2, pointer`,
        }}
      >
        <span>logout</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
        >
          <path
            fill="currentColor"
            d="m17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4z"
          />
        </svg>
      </a>
    </div>
  );
}

export default Nav;
