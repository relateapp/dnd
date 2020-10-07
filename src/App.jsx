import React from 'react';
import mockData from './mockData';
import Node from './Node';
import DnDProvider from './components/DnDProvider';

const App = () => {
    const onDragEnd = (event, draggableId, droppableId) => {
        console.log('draggableId ->', draggableId);
        console.log('droppableId ->', droppableId);
    };

    const onDragMove = (event, draggable, droppable) => {
        console.log('droppable ->', droppable);
        // console.log('droppableId ->', droppableId);
    };

    const onDragStart = event => {
        console.log(event);
    }

    return (
        <div id="app">
            <DnDProvider
                // onDragStart={onDragStart}
                onDragEnd={onDragEnd}
                // onDragMove={onDragMove}
            >
                <Node/>
                {/*<NodeRenderContainer node={mockData}/>*/}
            </DnDProvider>
        </div>
    );
};

export default App;
