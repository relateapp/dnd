import React, { Component } from 'react';
import Node from './Node.jsx';

class NodeRenderContainer extends Component {
    constructor (props) {
        super(props);
    }

    nodeRender = (node) => {
        let children = node.children,
            nodeElement = null;

        if (children.length) {
            nodeElement = (
                <Node
                    {...this.props}
                    key={node.id}
                    node={node}
                >
                    {
                        children.map((children) => this.nodeRender(children))
                    }
                </Node>
            );
        } else {
            nodeElement =
                <Node
                    {...this.props}
                    key={node.id}
                    node={node}
                />;
        }

        return nodeElement;
    };

    render () {
        return this.nodeRender(this.props.node);
    }
}

export default NodeRenderContainer;

