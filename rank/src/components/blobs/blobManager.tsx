import { getAuth } from "firebase/auth";
import React, { useState } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";
import RankableItem from "../../models/RankableItem";
import { PostNewRank } from "../../services/ranksService";

export interface BlobManagerProps {
  blobs: RankableItem[];
  templateId: string;
}

function BlobManager(props: BlobManagerProps) {
  const defaultList = props.blobs.map((blob) => {
    return blob.name;
  });
  const [blobList, setBloblist] = useState(defaultList);

  function save(blobList: string[]) {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      PostNewRank(blobList, props.templateId, user.email ?? "").then(
        (response) => console.log("saved")
      );
    } else {
      console.log("error, not signed in"); // TODO surface
    }
  }

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
                <Draggable key={item + index} draggableId={item} index={index}>
                  {(provided) => (
                    <>
                      <div
                        className="item-container card row"
                        ref={provided.innerRef}
                        {...provided.dragHandleProps}
                        {...provided.draggableProps}
                      >
                        <div>
                          <b>{index + 1}</b>. {item}
                        </div>
                        <div className="controls">
                          <div
                            onClick={(e) => {
                              moveItem(index, blobList.length);
                            }}
                          >
                            <i className="fa-solid fa-angles-down"></i>
                          </div>
                          <div
                            onClick={(e) => {
                              moveItem(index, index + 1);
                            }}
                          >
                            <i className="fa-solid fa-angle-down"></i>
                          </div>
                          <div
                            onClick={(e) => {
                              moveItem(index, index - 1);
                            }}
                          >
                            <i className="fa-solid fa-angle-up"></i>
                          </div>
                          <div
                            onClick={(e) => {
                              moveItem(index, 0);
                            }}
                          >
                            <i className="fa-solid fa-angles-up"></i>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      <button className="button-styles" onClick={() => save(blobList)}>
        Save
      </button>
    </>
  );

  function moveItem(from: number, to: number) {
    if (from < 0 || to < 0) {
      return;
    }
    var updatedList = [...blobList];
    const [item] = updatedList.splice(from, 1);
    updatedList.splice(to, 0, item);
    setBloblist(updatedList);
  }

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
