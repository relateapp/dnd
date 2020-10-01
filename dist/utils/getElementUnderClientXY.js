'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var getElementUnderClientXY = function getElementUnderClientXY(elem, clientX, clientY) {
    var display = elem.style.display || '';

    elem.style.display = 'none';

    var target = document.elementFromPoint(clientX, clientY);

    elem.style.display = display;

    if (!target || target === document) {
        // это бывает при выносе за границы окна
        target = document.body; // поправить значение, чтобы был именно элемент
    }

    return target;
};

exports.default = getElementUnderClientXY;