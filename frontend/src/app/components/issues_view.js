
/**
 * @file issue_view.js
 * @brief A component that displays a list of issues related to product compatibility, 
 *        such as "avoid" and "use with" recommendations.
 * 
 * @param {Array} issues - An object containing "avoid" and "use with" issues.
 * @param {Function} onClose - Callback function to close the issues view.
 * @param {boolean} isThemeChanged - Boolean indicating if the theme is changed.
 * 
 * @returns {JSX.Element} The rendered issues list view component.
 */

import React, { useState } from 'react';
import '../styles/fridge.css';

/**
 * @function IssuesList
 * @brief Renders a list of product compatibility issues, formatted based on "avoid" and "use with" categories.
 * 
 * @param {Object} props - The component props.
 * @param {Array} props.issues - An object containing arrays of "avoid" and "use with" issues.
 * @param {Function} props.onClose - Callback function to close the issues view.
 * @param {boolean} props.isThemeChanged - Boolean indicating if the theme is changed.
 * 
 * @returns {JSX.Element} The rendered issues list view component.
 */

const IssuesList = ({ issues, onClose, isThemeChanged }) => { 
    const [popupContent, setPopupContent] = useState(null);
    const avoidIssues = issues.avoid || [];
    const usewithIssues = issues.usewith || [];
    const usewhenIssues = issues.usewhen || [];

    const handleTagClick = async (tag) => {
        try {
            console.log("this is the tag",tag)
            const response = await fetch('/data/tags.json');
            const data = await response.json();
            console.log("this is data: ", data);
    
            const tagDescription = data[tag];
    
            if (tagDescription) {
                setPopupContent(tagDescription);
                console.log("this is description", tagDescription);
            } else {
                console.log('Tag not found in the data');
            }
        } catch (error) {
            console.error("Error fetching the tag data:", error);
        }
    };
    

    /**
     * @const avoidMessages
     * @brief Formats "avoid" issues into messages with highlighted product and source names.
     * 
     * @returns {Array} An array of formatted avoid messages as JSX elements.
     */
    
    const avoidMessages = avoidIssues.map(item => {
        console.log("this is the 1: ",item);
        const comp = <b>{item.comp}</b>;
        const source = <b>{item.source}</b>;
        const message = item.rule.message; 
        const tag = item.rule.tag;
        console.log("this is the 13: ",item.rule.tag);
        const additionalTags = item.rule.additionalTags || [];
        console.log("this is the 15: ",item.rule.additionalTags);
        
        // from addtionalTags remove tag that has tag in it
        const additionalTagsFiltered = additionalTags.filter((additionalTag) => !additionalTag.includes(tag));

        const messageWithoutLastWord = message.slice(0, message.lastIndexOf(' '))+ ' ';

        return (
            <span>
                {comp} contains <span onClick={() => handleTagClick(tag)}
                style={{
                    cursor: isThemeChanged 
                    ? `url('/select2.png') 2 2, pointer` 
                    : `url('/select1.png') 2 2, pointer`,}} 
                className={`highlighted-tag ${isThemeChanged ? 'dark-theme' : 'light-theme'}`}>
                {tag}</span>, so please {messageWithoutLastWord} {'[ '}              
                <span>
                {additionalTagsFiltered.map((additionalTag, index) => (
                    <span key={index}>
                        <span 
                        onClick={() => handleTagClick(additionalTag)} 
                        style={{
                            cursor: isThemeChanged 
                            ? `url('/select2.png') 2 2, pointer` 
                            : `url('/select1.png') 2 2, pointer`,}}
                        className={`highlighted-tag ${isThemeChanged ? 'dark-theme' : 'light-theme'}`}>
                            {additionalTag}
                        </span>
                        {index < additionalTagsFiltered.length - 1 && ', '}
                    </span>
                ))}
                </span> 
                {' ]'} like {source}.

            </span>
        );
    });


    /**
     * @const usewithMessages
     * @brief Formats "use with" issues into messages with highlighted source names.
     * 
     * @returns {Array} An array of formatted "use with" messages as JSX elements.
     */

    const usewithMessages = usewithIssues.map(item => {
        const source = <b>{item.source}</b>; 
        const message = item.rule.message; 
        console.log("this is the 2: ",item);

        return (
            <span>
                {source}: {message}
            </span>
        );
    });

    const usewhenMessages = usewhenIssues.map(item => {
        const source = <b>{item.source}</b>; 
        const message = item.rule.message; 

        return (
            <span>
                {source}: {message}
            </span>
        );
    });

    /**
     * @const allMessages
     * @brief Combines all formatted messages (avoid and use with) into a single array.
     * 
     * @type {Array}
     */
    const allMessages = [...avoidMessages, ...usewithMessages, ...usewhenMessages];

    return (
        <div className="issues-view" style={{ backgroundImage: isThemeChanged ? `url('/clipboard-blue.png')` : `url('/clipboard-pink.png')` }}>            
        <button onClick={onClose} className="close-button" 
        style={{ backgroundColor: isThemeChanged ? '#03045E' : '#ff0090',
        top: '38px',
        right: '-1px',
        cursor: isThemeChanged 
        ? `url('/select2.png') 2 2, pointer` 
        : `url('/select1.png') 2 2, pointer`, }}
        >X</button>
        <h3 className="issues-title" style={{ color: isThemeChanged ? '#00028E' : '#9c0060' }}>Issues Found</h3>
        <div className="issues-card">
            <ul className="issues-list">
                {allMessages.map((message, index) => (
                    <li 
                    key={index} 
                    className="issue-item" 
                    style={{ backgroundColor: isThemeChanged ? '#D0F7FF' : '#FFDDFACC', color: 'black' }}>
                        {message}
                    </li>
                ))}
            </ul>
        </div>
        {popupContent && (
                <div className="popup">
                    <div className="popup-content">
                        <h4>Tag Description</h4>
                        <p>{popupContent}</p>
                        <button 
                        className={`close-tag-button ${isThemeChanged ? 'theme-dark' : ''}`}
                        onClick={() => setPopupContent(null)}
                        style={{         
                            cursor: isThemeChanged 
                            ? `url('/select2.png') 2 2, pointer` 
                            : `url('/select1.png') 2 2, pointer`,}}><strong>Close</strong></button>
                    </div>
                </div>
            )}
    </div>
    );
};

export default IssuesList;