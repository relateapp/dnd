import React from 'react';
import mockData from './mockData';
import NodeRenderContainer from './NodeRenderContainer';
import DnDProvider from './components/DnDProvider';

const App = () => {
    const onDragEnd = (event, draggableId, droppableId) => {
        // console.log('event ->', event);
        // console.log('draggableId ->', draggableId);
        // console.log('droppableId ->', droppableId);
    };

    const onDragMove = (event, draggable, droppable) => {
        console.log('move ->');
        // console.log('droppable ->', droppable);
        // console.log('droppableId ->', droppableId);
    };

    return (
        <div id="app">
            <DnDProvider
                onDragEnd={onDragEnd}
                onDragMove={onDragMove}
            >
                <NodeRenderContainer node={mockData}/>
            </DnDProvider>
        </div>
    );
};

export default App;
