import React from 'react';

function BlobManager (props) {
    console.log(props);
    console.log(props.props)
    return (
        <div>
            <div className="App-demo">blobs go here {props.numBlobs}</div> 
            <ul>
                {getBlobs(props.blobs)}
            </ul>
        </div>
    );


    function getBlobs(blobs){
        blobs.sort((a,b) => { return a.rank - b.rank });
        return blobs.map( (blob, index) => { 
            return <li>{blob.blobName}</li>
        })
    }
}

export default BlobManager
