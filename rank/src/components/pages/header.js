import React from 'react';

function Header(props) {
    return (
        <div className="App-header">
            <p>
              Welcome to the {props.title} page.
            </p>
        </div>
    )
}

export default Header
