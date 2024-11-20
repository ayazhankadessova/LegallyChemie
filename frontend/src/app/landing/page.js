"use client";
import React, { useEffect, useState, useRef } from "react";
import "../styles/landing.css";
import Nav from "../components/navbar.js";

export default function Homepage() {
  const [name, setName] = useState("");
  const [isThemeChanged, setIsThemeChanged] = useState(false);
  const [loading, setLoading] = useState(true);
  const eyesRef = useRef([]);
  const anchorRef = useRef(null);

  useEffect(() => {
    const themeFromStorage = localStorage.getItem("theme");
    setTimeout(() => {
      setIsThemeChanged(themeFromStorage === "dark");
      setLoading(false); // setting loading to false after theme is loaded
    }, 100); // 0.1 second delay
    const params = new URLSearchParams(window.location.search);
    setName(params.get("name") || "there");
  }, []);

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

    // initial anchor position setup + re-setup on resize
    updateAnchorPosition();
    window.addEventListener("resize", updateAnchorPosition);

    return () => window.removeEventListener("resize", updateAnchorPosition);
  }, []);

  if (loading) {
    return <div></div>;
  }

  const gotoFridge = () => {
    window.location.href = `http://localhost:3000/fridge?name=${name}`;
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
          ? `url('/cursor2.png') 10 10, auto` 
          : `url('/cursor.png') 10 10, auto`,
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
        style={{
          backgroundColor: isThemeChanged ? "#03045E" : "#AA00FF",
          color: "white",
          padding: "10px 20px",
          borderRadius: "15px",
          fontSize: "20px",
          fontWeight: "bold",
          position: "absolute",
          bottom: "50px",
          right: "50px",
          cursor: isThemeChanged 
          ? `url('/select3.png') 10 10, pointer` 
          : `url('/select2.png') 10 10, pointer`,
      }}
      >
        change theme
      </button>
    </div>
  );
}
