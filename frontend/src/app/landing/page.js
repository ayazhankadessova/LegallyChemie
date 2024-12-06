"use client";
import React, { useEffect, useState, useRef } from "react";
import "../styles/landing.css";
import Nav from "../components/navbar.js";

import config from "../config.js";

const apiUrl = config.apiUrl; 
const frontendUrl = config.frontendUrl;

export default function Homepage() {
  const [name, setName] = useState("");
  const [isThemeChanged, setIsThemeChanged] = useState(false);
  const [loading, setLoading] = useState(true);
  const eyesRef = useRef([]);
  const anchorRef = useRef(null);
  const [selectedSkinType, setSelectedSkinType] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [previousSkinType, setPreviousSkinType] = useState(selectedSkinType);

  
  const skinTypes = ["Dry", "Oily", "Normal" ,"Combination", "Sensitive"];

  useEffect(() => {
    const themeFromStorage = localStorage.getItem("theme");

    setTimeout(() => {
      setIsThemeChanged(themeFromStorage === "dark");
      setLoading(false); // setting loading to false after theme is loaded
    }, 100); // 0.1 second delay

    const params = new URLSearchParams(window.location.search);
    setName(params.get("name") || "there");

    const fetchSkinType = async () => {
      try {
        const response = await fetch(apiUrl + '/skintype', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include', // Ensures cookies (like session) are sent with the request
        });
        if (response.ok) {
          const data = await response.json();
          setSelectedSkinType(data.skin_type || "Not Specified"); // Correcting the field to 'skin_type'
        } else {
          console.error("Failed to fetch skin type");
        }
      } catch (error) {
        console.error("Error fetching skin type:", error);
      }
    };
    
    fetchSkinType();
  }, []);

  const handleEdit = () => {
    setPreviousSkinType(selectedSkinType);
    setIsEditing(true); 
  };

  const handleSave = async () => {
    if (selectedSkinType === previousSkinType) {
      setIsEditing(false); 
      return; 
    }
  
    try {
      const response = await fetch(apiUrl + `/${selectedSkinType}/`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ skinType: selectedSkinType }),
      });
      if (response.ok) {
        setIsEditing(false); 
        setPreviousSkinType(selectedSkinType);
        alert("Skin type updated successfully!");
      } else {
        console.error("Failed to update skin type");
      }
    } catch (error) {
      console.error("Error updating skin type:", error);
    }
  };
  

  const calculateAngle = (cx, cy, ex, ey) => {
    const dy = ey - cy;
    const dx = ex - cx;
    const rad = Math.atan2(dy, dx);
    return rad * (180 / Math.PI);
  };

  useEffect(() => {
    const updateAnchorPosition = () => {
      if (anchorRef.current) {
        const rect = anchorRef.current.getBoundingClientRect();
        const anchorX = rect.left + rect.width / 2;
        const anchorY = rect.top + rect.height / 2;

        const handleMouseMove = (e) => {
          const angleDeg = calculateAngle(
            e.clientX,
            e.clientY,
            anchorX,
            anchorY
          );
          eyesRef.current.forEach((eye) => {
            if (eye) {
              eye.style.transform = `rotate(${90 + angleDeg}deg)`;
            }
          });
        };

        document.addEventListener("mousemove", handleMouseMove);

        return () => document.removeEventListener("mousemove", handleMouseMove);
      }
    };

    
    
    window.addEventListener("resize", updateAnchorPosition);

    // initial anchor position setup + re-setup on resize (with delay)
    setTimeout(() => {
       updateAnchorPosition();
    }, 300);

    return () => window.removeEventListener("resize", updateAnchorPosition);
  }, []);

  if (loading) {
    return <div></div>;
  }

  const gotoFridge = () => {
    window.location.href = frontendUrl + `/fridge?name=${name}`;
  };

  const handleChangeTheme = () => {
    const newTheme = !isThemeChanged;
    setIsThemeChanged(newTheme);
    localStorage.setItem("theme", newTheme ? "dark" : "light");
  };

  return (
    <div
      className="page"
      style={{
        backgroundColor: isThemeChanged ? "#EBFCFF" : "#FDEFFB",
        color: isThemeChanged ? "#03045E" : "#000000",
        backgroundImage: isThemeChanged
          ? "url(/loggedin2.png)"
          : "url(/loggedin.png)",
          cursor: isThemeChanged 
          ? `url('/cursor2.png'), auto` 
          : `url('/cursor1.png'), auto`,
      }}
    >
      <Nav name={name} banner="HOMEPAGE" isThemeChanged={isThemeChanged} />

      <div className="left_column">
        <div className="chemie-container">
          <img
            src={isThemeChanged ? "/chemie-blue.png" : "/chemie-pink.png"}
            alt="Icon"
            className="chemie"
            style={{ width: "auto" }}
          />
          <div
            ref={anchorRef}
            id="anchor"
            style={{
              width: "10px",
              height: "10px",
              position: "absolute",
              transform: "translate(45px, -10px)",
            }}
          >
            <img
              src="/eye.png"
              alt="Icon"
              className="eyes"
              ref={(el) => (eyesRef.current[0] = el)}
              style={{
                position: "absolute",
                width: "10px",
                height: "10px",
                left: "36px",
              }}
            />
            <img
              src="/eye.png"
              alt="Icon"
              className="eyes"
              ref={(el) => (eyesRef.current[1] = el)}
              style={{
                position: "absolute",
                width: "10px",
                height: "10px",
              }}
            />
          </div>
        </div>
      </div>

      <div className="right_column">
        <h1
          style={{
            color: isThemeChanged ? "#F4FDFF" : "#FEF5FF",
            WebkitTextStroke: isThemeChanged ? "3px navy" : "3px hotpink",
          }}
        >
          Hey {name} :)
        </h1>

        <div className="skintype-container">
          {!isEditing ? (
            <>
              <span className="skintype">Your Skin Type: {selectedSkinType}</span>
              <button onClick={handleEdit} className="edit-button">
                <img
                  src={isThemeChanged ? '/edit2.png' : '/edit.png'}
                  alt="Edit Icon"
                  className="edit-icon"
                  style={{          
                    cursor: isThemeChanged 
                    ? `url('/select2.png'), pointer` 
                    : `url('/select1.png'), pointer`,}}
                />
              </button>
            </>
          ) : (
            <div className="dropdown-container">
              <select
                value={selectedSkinType}
                onChange={(e) => setSelectedSkinType(e.target.value)}
                className="skin-type-dropdown"
              >
                {skinTypes.map((skinType, index) => (
                  <option key={index} value={skinType}>
                    {skinType}
                  </option>
                ))}
              </select>
              <button onClick={handleSave} className="save-button">
                <img
                  src={isThemeChanged ? '/check2.png' : '/check.png'}
                  alt="Check Icon"
                  className="check-icon"
                  style={{
                    cursor: isThemeChanged 
                    ? `url('/select2.png'), pointer` 
                    : `url('/select1.png'), pointer`,
                  }}
                />
              </button>
            </div>
          )}
        </div>

        <button
          className={`start-button ${isThemeChanged ? "theme-dark" : ""}`}
          onClick={gotoFridge}
        >
          <img src={isThemeChanged ? "/mouse2.png" : "/mouse.png"} alt="Icon" />
          access personal skincare fridge
        </button>
      </div>

      <button
        onClick={handleChangeTheme}
        className={`theme-button ${isThemeChanged ? 'dark-theme' : 'light-theme'}`}
      >
        change theme
      </button>
    </div>
  );
}
