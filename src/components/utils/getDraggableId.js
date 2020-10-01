const getDraggableId = element => element
    .closest('.draggable')
    .dataset
    .draggableId;

export default getDraggableId;
