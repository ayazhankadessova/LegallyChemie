import React from 'react';
import '../styles/fridge.css';

const IssuesList = ({ issues, onClose, isThemeChanged }) => {
    //  

    return (
        <div className="issues-view" style={{ backgroundImage: `url('/clipboard-white.png')` }}>            <button onClick={onClose} className="close-button" style={{ backgroundColor: isThemeChanged ? '#03045E' : '#ff0090' }}>X</button>
            <div className="issues-card">
                <h3 className="issues-title" style={{ color: isThemeChanged ? '#00028E' : '#9c0060' }}>Issues Found</h3>
                <ul className="issues-list">
                    {issues.map((issue, index) => (
                        <li key={index} className="issue-item" style={{ color: isThemeChanged ? '#00028E' : '#9c0060' }}>
                            {issue}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default IssuesList;