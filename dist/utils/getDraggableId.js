'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var getDraggableId = function getDraggableId(element) {
    return element.closest('.draggable').dataset.draggableId;
};

exports.default = getDraggableId;