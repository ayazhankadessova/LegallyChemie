import React from 'react';
import '../styles/fridge.css';

const IssuesList = ({ issues, onClose, isThemeChanged }) => { 
    const avoid = issues.avoid;
    const issuemessages = [];
    avoid.forEach(item => {
        issuemessages.push(item.rule.message);
      });

    return (
        <div className="issues-view" style={{ backgroundImage: isThemeChanged ? `url('/clipboard-blue.png')` : `url('/clipboard-pink.png')` }}>            
        <button onClick={onClose} className="close-button" 
        style={{ backgroundColor: isThemeChanged ? '#03045E' : '#FF3EB5',
        top: '40px',
        right: '0px' }}
        >X</button>
        <h3 className="issues-title" style={{ color: isThemeChanged ? '#00028E' : '#9c0060' }}>Issues Found</h3>
        <div className="issues-card"
        style={{ backgroundColor: isThemeChanged ? '#D0F7FF' : '#FFDDFACC' }}>
            <ul className="issues-list">
                {issuemessages.map((issue, index) => (
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