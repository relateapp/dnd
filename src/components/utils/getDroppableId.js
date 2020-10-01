const getDroppableId = element => element
    .closest('.droppable')
    .dataset
    .droppableId;

export default getDroppableId;
