"use client"; 

import React, { useState, useEffect } from 'react';
import '../styles/newuser.css';
const apiUrl = process.env.NEXT_PUBLIC_API_URL;
const frontend_url = process.env.Front_End_URL


export default function NewUser() {
    const [selectedSkinType, setSelectedSkinType] = useState("");
    const [userName, setUserName] = useState("");

    useEffect(() => {
      const params = new URLSearchParams(window.location.search);
      const name = params.get("name");
      if (name) {
        setUserName(name);
      }
    }, []);

    const handleSubmit = async () => {
      if (!selectedSkinType) {
        alert("Please select your skin type!");
        return;
      }

      try {
        console.log("this is the selected skintyoe", selectedSkinType)
        const response = await fetch(`${apiUrl}/${selectedSkinType}/`, {
          method: "POST",
          credentials: 'include',
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ skinType: selectedSkinType }),
        });
  
        if (response.ok) {
          console.log("Successfully submitted skintype to backend");
          window.location.href = `${frontend_url}/landing?name=${userName}`;
        } else {
          console.log("Failed to submit skintype, status code:", response.status);
          console.error("Failed to submit skin type");
        }
      } catch (error) {
        console.error("Error submitting skin type:", error);
      }
    };

  return (
    <div
      className={`h-screen bg-cover bg-center flex flex-col justify-center`}
      style={{
        backgroundImage:  'url(/newuser_bg.png)',
        backgroundColor:  '#FFE8F2',
        color: '#574754',
        cursor: `url('/cursor1.png'), auto`,
      }}
    >
      <h1>
      What is your skin type?
      </h1>
      <div className="choice-container">
        {["Dry", "Oily", "Normal" ,"Combination", "Sensitive"].map((type) => (
          <label key={type} className="label-large">
            <input
              type="radio"
              name="skinType"
              value={type}
              checked={selectedSkinType === type}
              onChange={(e) => setSelectedSkinType(e.target.value)}
              className="cursor-pointer"
            />
            <span className="text-2xl">{type}</span>
          </label>
        ))}
      </div>
      <button
        onClick={handleSubmit}
        className="submit-button"
      >
        Submit
      </button>
        </div>
  );
}
