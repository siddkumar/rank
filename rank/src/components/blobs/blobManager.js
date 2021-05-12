import React from 'react';

class  BlobManager extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            numBlobs: 0
        }
    }

    render () {
        return (
            <div className="App-demo">blobs go here {this.state.numBlobs}</div> 
        )
    }
}

export default BlobManager
