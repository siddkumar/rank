import React from 'react';
import Blob from '../blobs/Blob';

export interface BlobManagerProps {
    blobs: Blob[]
}

function BlobManager (props : BlobManagerProps) {
    return (
        <div>
            <div className="App-demo">blobs go here {props.blobs.length}</div> 
            <ul>
                {getBlobs(props.blobs)}
            </ul>
        </div>
    );


    function getBlobs(blobs: Blob[]){
        blobs.sort((a,b) => { return a.rank - b.rank });
        return blobs.map( (blob, index) => { 
            return <li>{blob.blobName}</li>
        })
    }
}

export default BlobManager
