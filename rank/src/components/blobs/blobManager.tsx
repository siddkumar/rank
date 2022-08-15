import React, { useState } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";
import RankableItem from "../../models/RankableItem";

export interface BlobManagerProps {
  blobs: RankableItem[];
}

function BlobManager(props: BlobManagerProps) {
  const defaultList = props.blobs.map((blob) => {
    return blob.name;
  });
  const [blobList, setBloblist] = useState(defaultList);

  return (
    <>
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
      <button
        onClick={() => {
          console.log(blobList);
        }}
      >
        Save
      </button>
    </>
  );

  function handleDrop(droppedItem: DropResult) {
    var updatedList = [...blobList];
    const [reorderedItem] = updatedList.splice(droppedItem.source.index, 1);
    // Add dropped item
    updatedList.splice(droppedItem!.destination!.index, 0, reorderedItem);
    // Update State
    setBloblist(updatedList);
  }

  function getBlobs(blobs: RankableItem[]) {
    blobs.sort((a, b) => {
      return a.rank - b.rank;
    });
    return blobs.map((blob, index) => {
      return <li>{blob.name}</li>;
    });
  }
}

export default BlobManager;
