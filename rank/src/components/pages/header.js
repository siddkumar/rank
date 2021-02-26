import React from 'react';

class Header extends React.Component {
    constructor(props) {
        super(props);
        this.state = { title: props.title };
    }

    render() {
        return (
            <header className="App-header">
                <p>
                  Welcome to the {this.state.title} page.
                </p>
            </header>
        )
    }
}

export default Header;