'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var getDroppableId = function getDroppableId(element) {
    return element.closest('.droppable').dataset.droppableId;
};

exports.default = getDroppableId;