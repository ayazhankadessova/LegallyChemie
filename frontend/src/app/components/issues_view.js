import React from 'react';
import '../styles/fridge.css';

const IssuesList = ({ issues, onClose, isThemeChanged }) => { 
    const avoidIssues = issues.avoid || [];
    const usewithIssues = issues.usewith || [];
    
    // formatting avoid issues: (comp product name) contains (tag), so please (message) like (source product name)
    const avoidMessages = avoidIssues.map(item => {
        const comp = <b>{item.comp}</b>;
        const source = <b>{item.source}</b>;
        const message = item.rule.message.toLowerCase(); // Convert message to lowercase

        return (
            <span>
                {comp} contains {item.rule.tag}, so please {message} like {source}.
            </span>
        );
    });

    // formatting usewith issues: For (source): (message)
    const usewithMessages = usewithIssues.map(item => {
        const source = <b>{item.source}</b>; 
        const message = item.message.toLowerCase(); 

        return (
            <span>
                For {source}: {message}
            </span>
        );
    });

    // combining all messages into a single array
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