
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

import React from 'react';
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
    const avoidIssues = issues.avoid || [];
    const usewithIssues = issues.usewith || [];
    
    /**
     * @const avoidMessages
     * @brief Formats "avoid" issues into messages with highlighted product and source names.
     * 
     * @returns {Array} An array of formatted avoid messages as JSX elements.
     */
    
    const avoidMessages = avoidIssues.map(item => {
        const comp = <b>{item.comp}</b>;
        const source = <b>{item.source}</b>;
        const message = item.rule.message; 
        console.log("this is the 13: ",item.rule.tag);

        return (
            <span>
                {comp} contains {item.rule.tag}, so please {message} like {source}.
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
        const message = item.message; 

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
    const allMessages = [...avoidMessages, ...usewithMessages];

    return (
        <div className="issues-view" style={{ backgroundImage: isThemeChanged ? `url('/clipboard-blue.png')` : `url('/clipboard-pink.png')` }}>            
        <button onClick={onClose} className="close-button" 
        style={{ backgroundColor: isThemeChanged ? '#03045E' : '#FF3EB5',
        border: `2px solid ${isThemeChanged ? '#D0F7FF' : '#FFDDFACC'}`,
        top: '38px',
        right: '-1px' }}
        >X</button>
        <h3 className="issues-title" style={{ color: isThemeChanged ? '#00028E' : '#9c0060' }}>Issues Found</h3>
        <div className="issues-card">
            <ul className="issues-list">
                {allMessages.map((message, index) => (
                    <li 
                    key={index} 
                    className="issue-item" 
                    style={{ backgroundColor: isThemeChanged ? '#D0F7FF' : '#FFDDFACC' }}>
                        {message}
                    </li>
                ))}
            </ul>
        </div>
    </div>
    );
};

export default IssuesList;