import React, {Component} from 'react';
import DraggableHoc from '../components/DraggableHoc';
import DroppableHoc from '../components/DroppableHoc';

import ConnectedNode from './index';

class Node extends Component {
    constructor(props) {
        super(props);
    }

    setRef = elem => {
        this.props.setDraggableRef(elem);
        this.props.setDroppableRef(elem);
    };

    renderChild = (childId, indents) => {
        const { parentNodeId } = this.props;

        let indentCounter = indents;

        if (parentNodeId) indentCounter++;

        return (
            <ConnectedNode
                {...this.props}
                key={childId}
                id={childId}
                indents={indentCounter}
            />
        );
    };

    render() {
        const {children, nodeName, indents} = this.props;

        const childrenElement = (
            <div className="node-children">
                {children.map(id => this.renderChild(id, indents))}
            </div>
        );

        const nodeStyle = {
            height: 30
        };

        const nodeNameStyle = {
            paddingLeft: `${indents * 20}`
        };

        return (
            <div className="node" style={nodeStyle}>
                <span style={nodeNameStyle} className="node-name">
                    {nodeName}
                </span>
                <div className="node-children">
                    {childrenElement}
                </div>
            </div>
        );
    }
};

export default DroppableHoc(DraggableHoc(Node));
