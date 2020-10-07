const NODE_TYPE = {
    ELEMENT_NODE: 'ELEMENT_NODE',
    TEXT_NODE:    'TEXT_NODE'
};

const ELEMENT_TYPE = {
    COMPONENT: 'component',
    NODE:      'node'
};

const normalizedNodes = {
    '5c6d2781d1f753af2603765':  {
        id:           '5c6d2781d1f753af2603765',
        type:         ELEMENT_TYPE.NODE,
        nodeType:     NODE_TYPE.ELEMENT_NODE,
        nodeName:     'body',
        attributes:   {},
        parentNodeId: null,
        children:     ['5c6d2781d1f753af2603cef7']
    },
    '5c6d2781d1f753af2603cef7': {
        id:           '5c6d2781d1f753af2603cef7',
        type:         ELEMENT_TYPE.NODE,
        nodeType:     NODE_TYPE.ELEMENT_NODE,
        nodeName:     'h1',
        attributes:   {},
        parentNodeId: '5c6d2781d1f753af2603765',
        children:     ['5f7c5a1cddf9f0b7653c9d7a', '5f7c5a1aaf491585d34bde95']
    },
    '5f7c5a1cddf9f0b7653c9d7a': {
        id:           '5f7c5a1cddf9f0b7653c9d7a',
        type:         ELEMENT_TYPE.NODE,
        nodeType:     NODE_TYPE.TEXT_NODE,
        textContent:  'Write Something',
        parentNodeId: '5c6d2781d1f753af2603cef7'
    },
    '5f7c5a1aaf491585d34bde95': {
        id:           '5f7c5a1aaf491585d34bde95',
        type:         ELEMENT_TYPE.NODE,
        nodeType:     NODE_TYPE.ELEMENT_NODE,
        nodeName:     'img',
        attributes:   {},
        parentNodeId: '5c6d2781d1f753af2603cef7',
        children:     []
    },
};

export default normalizedNodes;
