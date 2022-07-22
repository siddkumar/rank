import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import Blob from '../../models/Blob';

export interface BlobManagerProps {
    blobs: Blob[]
}

function BlobManager (props : BlobManagerProps) {

    const defaultList = props.blobs.map((blob) => { return blob.blobName; } )
    const [blobList, setBloblist] = useState(defaultList);

    return (
        <div>
            <DragDropContext onDragEnd={handleDrop}>
                <Droppable droppableId="list-container">
          {(provided) => (


            <div
              className="list-container"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {blobList.map((item, index) => (
                <Draggable key={item} draggableId={item} index={index}>
                  {(provided) => (
                    <div
                      className="item-container"
                      ref={provided.innerRef}
                      {...provided.dragHandleProps}
                      {...provided.draggableProps}
                    >
                      {item}
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>

            </DragDropContext>
            {/* <ul>
                {getBlobs(blobList)}
            </ul> */}
        </div>
    );

    function handleDrop(droppedItem: DropResult) {
        var updatedList = [...blobList]
        const [reorderedItem] = updatedList.splice(droppedItem.source.index, 1)
        // Add dropped item
        updatedList.splice(droppedItem!.destination!.index, 0, reorderedItem);
        // Update State
        setBloblist(updatedList);
    }


    function getBlobs(blobs: Blob[]){
        blobs.sort((a,b) => { return a.rank - b.rank });
        return blobs.map( (blob, index) => { 
            return <li>{blob.blobName}</li>
        })
    }
}

export default BlobManager
