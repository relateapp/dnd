import React, {Component} from 'react';
import {getElementUnderClientXY, getCoords} from '../utils';

/**
 * "Аватар" - элемент, который перетаскивается.
 *
 * В простейшем случае аватаром является сам переносимый элемент
 * Также аватар может быть клонированным элементом
 * Также аватар может быть иконкой и вообще чем угодно.
 */
export default class DragAvatar extends Component {
    constructor(props) {
        super(props);
        /** "родительская" зона переноса */
        this._dragZone = props.dragZone;

        /**
         * подэлемент родительской зоны, к которому относится аватар
         * по умолчанию - элемент, соответствующий всей зоне
         * может быть уточнен в initFromEvent
         */
        this._dragZoneElem = props.dragElem;

        /**
         * Сам элемент аватара, который будет носиться по экрану.
         * Инициализуется в initFromEvent
         */
        this._elem = props.dragElem;
    }

    /**
     * Инициализовать this._elem и позиционировать его
     * При необходимости уточнить this._dragZoneElem
     * @param downX Координата X нажатия мыши
     * @param downY Координата Y нажатия мыши
     * @param event Текущее событие мыши
     */
    initFromEvent(downX, downY, event) {
        /* override */
        // Отмена переноса если переносимый
        // элемент не содержит класс draggable
        if (event.target.closest('.draggable') === null) return false;

        this._dragZoneElem = event.target;

        let elem = this._elem = this._dragZoneElem.cloneNode(true);

        elem.classList.add('avatar');

        // создать вспомогательные свойства shiftX/shiftY
        let coords = getCoords(this._dragZoneElem);

        this._shiftX = downX - coords.left;
        this._shiftY = downY - coords.top;

        // инициировать начало переноса
        document.body.appendChild(elem);
        // elem.style.zIndex = 9999;
        // elem.style.position = 'absolute';
        elem.style.display = 'none';

        return true;
    }

    /**
     * Возвращает информацию о переносимом элементе для DropTarget
     * @param event
     */
    getDragInfo(event) {
        // тут может быть еще какая-то информация, необходимая для обработки конца или процесса переноса
        return {
            elem:         this._elem,
            dragZoneElem: this._dragZoneElem,
            dragZone:     this._dragZone
        };
    }

    /**
     * Возвращает текущий самый глубокий DOM-элемент под this._elem
     * Приватное свойство _currentTargetElem обновляется при каждом передвижении
     */
    getTargetElem() {
        return this._currentTargetElem;
    };

    /**
     * При каждом движении мыши перемещает this._elem
     * и записывает текущий элемент под this._elem в _currentTargetElem
     * @param event
     */
    onDragMove(event) {
        this._elem.style.left = event.pageX - this._shiftX + 'px';
        this._elem.style.top = event.pageY - this._shiftY + 'px';

        this._currentTargetElem = getElementUnderClientXY(this._elem, event.clientX, event.clientY);
    };

    /**
     * Действия с аватаром, когда перенос не удался
     * Например, можно вернуть элемент обратно или уничтожить
     */
    onDragCancel() {
        /* override */
        // default behaviour
        this._destroy();
    };

    /**
     * Действия с аватаром после успешного переноса
     */
    onDragEnd() {
        /* override */
        // default behaviour
        this._destroy();
    };

    _destroy() {
        this._elem.parentNode.removeChild(this._elem);
    }
}

