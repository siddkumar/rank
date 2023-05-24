import React, { useState } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";
import RankableItem from "../../models/RankableItem";
import { RankableRow } from "./rankableRow";

export interface ListRankerProps {
  rankableList: RankableItem[];
  templateId: string;
  onSave: (rankableStrings: string[]) => void;
  onSaveAs?: (rankableStrings: string[]) => void;
}

function ListRanker(props: ListRankerProps) {
  const defaultList = props.rankableList.map((rankableItem) => {
    return rankableItem.name;
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
                <Draggable key={item + index} draggableId={item} index={index}>
                  {(provided) => (
                    <>
                      <div
                        className="item-container card row"
                        ref={provided.innerRef}
                        {...provided.dragHandleProps}
                        {...provided.draggableProps}
                      >
                        <RankableRow
                          index={index}
                          item={item}
                          onDown={() => moveItem(index, index + 1)}
                          onUp={() => moveItem(index, index - 1)}
                          onTop={() => moveItem(index, 0)}
                          onBotton={() => moveItem(index, blobList.length)}
                        />
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
      <div className="list-ranker-button-row">
        <div className={props.onSaveAs ? "button-wrapper" : "w-100"}>
          <button
            className="button-styles w-100"
            onClick={() => props.onSave(blobList)}
          >
            Save
          </button>
        </div>
        {props.onSaveAs && (
          <div className="button-wrapper">
            <button
              className="button-styles w-100"
              onClick={() => {
                if (props.onSaveAs) {
                  props.onSaveAs(blobList);
                } else {
                  console.log("error, save as func not provided");
                }
              }}
            >
              Save As
            </button>
          </div>
        )}
      </div>
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
}

export default ListRanker;
