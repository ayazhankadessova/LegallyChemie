
/**
 * @file product_view.js
 * @brief displays a detailed view of a selected product with options to delete or close the view.
 * 
 * @param {Object} selectedProduct - The product object selected by the user.
 * @param {Function} onDelete - Callback function to delete the selected product.
 * @param {Function} onClose - Callback function to close the product view.
 * @param {boolean} isThemeChanged - Boolean indicating if the theme is changed.
 * @param {string} day - The day (AM/PM) associated with the product.
 * 
 * @returns {JSX.Element|null} The rendered product view component or null if no product is selected.
 */

import React, { useState, useEffect } from "react";
import '../styles/fridge.css';
import Box from '@mui/material/Box';
import Rating from '@mui/material/Rating';
import Typography from '@mui/material/Typography';
import StarIcon from '@mui/icons-material/Star';

import config from "../config.js";

const apiUrl = config.apiUrl; 
const frontendUrl = config.frontendUrl;

const labels = {
    0: 'no rating',
    1: 'horrible',
    2: 'poor',
    3: 'ok',
    4: 'good',
    5: 'excellent',
};

function getLabelText(value) {
    return `${value} Star${value !== 1 ? 's' : ''}, ${labels[value]}`;
}

/**
 * @function ProductCard
 * @brief renders a detailed view of the selected product, allowing the user to delete or close it.
 * 
 * @param {Object} props - the component props.
 * @param {Object} props.selectedProduct - the product object selected by the user.
 * @param {Function} props.onDelete - callback function to delete the selected product.
 * @param {Function} props.onClose - callback function to close the product view.
 * @param {boolean} props.isThemeChanged - boolean indicating if the theme is changed.
 * @param {string} props.day - the day (AM/PM) associated with the product.
 * 
 * @returns {JSX.Element|null} the rendered product view component or null if no product is selected.
 */


const ProductCard = ({ selectedProduct, onDelete, onClose, isThemeChanged, day }) => {
    const [rating, setRating] = useState(0);
    const [oldRating, setOldRating] = useState(0);
    const [communityRating, setCommunityRating] = useState({});
    const [hover, setHover] = useState(-1);
    const [error, setError] = useState(null);
    const [isUpdating, setIsUpdating] = useState(false);

    const fetchRating = async () => {
        try {
            console.log("This is the selected product id: ", selectedProduct.id);
            console.log("Fetching rating for the product");
            const response = await fetch(
                apiUrl + `/${day}/products/${selectedProduct.id}/rating`,
                { method: "GET", credentials: "include" }
            );

            if (!response.ok) {
                throw new Error("Failed to fetch rating");
            }

            const data = await response.json();
            console.log("This is the rating for the product fetched from the function: ", data);
            setRating(data.user_rating);
            setOldRating(data.user_rating);
            setCommunityRating(data.community_rating);
        } catch (err) {
            setError(err.message);
        }
    };

    useEffect(() => {
        if (selectedProduct) {
            fetchRating();
        }
    }, [selectedProduct, day]);

    if (!selectedProduct) {
        return null;
    }

    const handleDelete = () => {
        const confirmed = window.confirm("Are you sure you want to delete this product?");
        if (confirmed) {
            onDelete(selectedProduct.id, day);
        }
    };

    const handleRatingChange = async (newValue) => {
        setIsUpdating(true);
        try {
            const response = await fetch(
                apiUrl + `/${day}/products/${selectedProduct.id}/${newValue}/${oldRating}`,
                {
                    method: 'PATCH',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ rating: newValue }),
                }
            );
    
            if (!response.ok) {
                throw new Error('Failed to update rating');
            }
    
            const data = await response.json();
            console.log('Rating updated successfully:', data);
    
            setOldRating(newValue);
    
            await fetchRating();
        } catch (error) {
            console.error('Error updating rating:', error);
        }
        finally {
            setIsUpdating(false);
        }
    };
    
    

    console.log("Selected Product:", selectedProduct);

    return (
        <div
            className="product-view"
            style={{
                backgroundColor: isThemeChanged ? "#00CEF7" : "#FFAADF",
            }}
        >
            <button
                onClick={onClose}
                className="close-button"
                style={{
                    backgroundColor: isThemeChanged ? "#03045E" : "#ff0090",
                    cursor: isThemeChanged
                        ? `url('/select2.png') 2 2, pointer`
                        : `url('/select1.png') 2 2, pointer`,
                }}
            >
                X
            </button>
            <div className="product-card">
                <h3
                    className="product-name"
                    style={{ color: isThemeChanged ? "#00028E" : "#9c0060" }}
                >
                    {selectedProduct.name}
                </h3>
                <div className="image-container">
                    <img src={selectedProduct.image} alt={selectedProduct.name} />
                </div>
                <p className="product-brand">
                    <strong>Brand:</strong> {selectedProduct.brand}
                </p>
                <p className="product-description">
                    <strong>Description:</strong> {selectedProduct.description}
                </p>
                <details className="product-ingredients">
                    <summary>
                        <strong>Ingredients:</strong>
                    </summary>
                    {selectedProduct.ingredients.join(", ")}
                </details>
                <div className="horizontal-line"></div>
                <div className="product-rating" style={{ textAlign: "left", paddingLeft: "5px" }}>
                    <Typography component="legend" sx={{ fontFamily: "Montserrat, sans-serif", fontSize: "15px" }}>
                        <strong>My Rating:</strong>
                    </Typography>
                    <Box sx={{ "& > legend": { mt: 1 } }}>
                        {rating !== null && <Box>{labels[hover !== -1 ? hover : rating]}</Box>}
                        <Rating
                            name="product-rating"
                            value={rating}
                            precision={1}
                            getLabelText={getLabelText}
                            onChange={(event, newValue) => handleRatingChange(newValue)}
                            onChangeActive={(event, newHover) => {
                                setHover(newHover);
                            }}
                            disabled={isUpdating}
                            emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
                            icon={
                                <StarIcon
                                    fontSize="inherit"
                                    style={{
                                        color: isThemeChanged ? "#03045E" : "#FF3EB5",
                                    }}
                                />
                            }
                        />
                    </Box>
                </div>
                <div className="community-rating" style={{ textAlign: "left", paddingLeft: "5px" }}>
                    <Typography component="legend" sx={{ fontFamily: "Montserrat, sans-serif", fontSize: "15px" }}>
                        <strong>Community Ratings:</strong>
                    </Typography>
                    {Object.keys(communityRating).map((skinType) => (
                        <div
                            key={skinType}
                            className="community-rating-item"
                            style={{
                                display: "flex",
                                alignItems: "center", 
                                marginTop: "5px", 
                            }}
                        >
                            <span style={{ marginRight: "10px" }}>♡ {skinType}:</span>
                            <Rating
                                name={`community-rating-${skinType}`}
                                value={communityRating[skinType]}
                                precision={0.1}
                                readOnly
                                emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
                                icon={
                                    <StarIcon
                                        fontSize="inherit"
                                        style={{
                                            color: isThemeChanged ? "#03045E" : "#FF3EB5",
                                        }}
                                    />
                                }
                            />
                        </div>
                    ))}
                </div>
                <button
                    onClick={handleDelete}
                    style={{
                        position: "relative",
                        marginLeft: "320px",
                        marginTop: "0",
                        backgroundImage: isThemeChanged
                            ? "url(/trashcan2.png)"
                            : "url(/trashcan1.png)",
                        backgroundSize: "contain",
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "center",
                        width: "32px",
                        height: "32px",
                        border: "none",
                        cursor: isThemeChanged
                            ? `url('/select2.png') 2 2, pointer`
                            : `url('/select1.png') 2 2, pointer`,
                    }}
                ></button>
            </div>
        </div>
    );
};

export default ProductCard;