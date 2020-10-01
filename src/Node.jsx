import React, {Component} from 'react';
import DraggableHoc from './components/DraggableHoc';
import DroppableHoc from './components/DroppableHoc';

class dropTargetConnector {
    constructor(props) {
        this.props = props;
    }

    showHoverIndication (dropTarget) {
        dropTarget.addIndicationClass('hover');
    }

    hideHoverIndication (dropTarget) {
        dropTarget.removeIndicationClass(['under', 'hover', 'above', 'middle']);
    }

    onDragEnd (dropTarget, avatar, event) {
        let avatarInfo = avatar.getDragInfo(event);

        dropTarget.props.onDragEnd({
            dragZoneElement: avatarInfo.dragZone._elem,
            dropTargetElement: dropTarget._elem,
            dropPosition: dropTarget.dropPosition,
            avatar: avatar,
        });
    }

    onDragMove (dropTarget, avatar, event) {
        if (dropTarget._targetElem) {
            const clientY = event.clientY;

            const { top, height } = dropTarget._targetElem.getBoundingClientRect();

            const elementPart = height / 3;
            const middle = top + height / 2;
            const above = middle - elementPart;
            const under = middle + elementPart;

            if (clientY < above) {
                dropTarget.removeIndicationClass(['under', 'middle']);
                dropTarget.addIndicationClass('above');
                dropTarget.dropPosition = 'above';
            } else if (clientY > under) {
                dropTarget.removeIndicationClass(['above', 'middle']);
                dropTarget.addIndicationClass('under');
                dropTarget. dropPosition = 'under';
            } else if (clientY > above && clientY < under) {
                dropTarget.removeIndicationClass(['above', 'under']);
                dropTarget.addIndicationClass('middle');
                dropTarget.dropPosition = 'middle';
            }
        }
    }
}

class Node extends Component {
    constructor(props) {
        super(props);
    }

    // componentDidUpdate(prevProps, prevState) {
    //     if (prevProps.dropTargetElement !== this.props.dropTargetElement) {
    //         console.log('RECIVED new dragZoneElement', this.props.dragZoneElement);
    //         console.log('RECIVED new dropTargetElement', this.props.dropTargetElement);
    //     }
    // }

    setRef = elem => {
        this.props.setDraggableRef(elem);
        this.props.setDroppableRef(elem);
    };

    render() {
        let  { node, children } = this.props,
            Tag = node.nodeType;

        return (
            <React.Fragment>
                <Tag
                    key={node.id}
                >
                    {
                        node.textContent
                            ?
                            <span
                                ref={this.setRef}
                                className="draggable droppable"
                                data-draggable-id={node.id}
                                data-droppable-id={node.id}
                                style={{ height: '30px', display: 'block', border: '1px solid black' }}
                                // className={node.attributes.class}
                                // data-node-id={node.id}
                            >
                            {`${node.textContent} - ${node.id}`}
                        </span> : null
                    }
                    {children}
                </Tag>
            </React.Fragment>
        );
    }
};

// export default DnDHoc(DropTargetHoc(DragZoneHoc(Node), dropTargetConnector));
export default DroppableHoc(DraggableHoc(Node));
