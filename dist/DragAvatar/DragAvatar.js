'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _utils = require('../utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * "Аватар" - элемент, который перетаскивается.
 *
 * В простейшем случае аватаром является сам переносимый элемент
 * Также аватар может быть клонированным элементом
 * Также аватар может быть иконкой и вообще чем угодно.
 */
var DragAvatar = function (_Component) {
    _inherits(DragAvatar, _Component);

    function DragAvatar(props) {
        _classCallCheck(this, DragAvatar);

        /** "родительская" зона переноса */
        var _this = _possibleConstructorReturn(this, (DragAvatar.__proto__ || Object.getPrototypeOf(DragAvatar)).call(this, props));

        _this._dragZone = props.dragZone;

        /**
         * подэлемент родительской зоны, к которому относится аватар
         * по умолчанию - элемент, соответствующий всей зоне
         * может быть уточнен в initFromEvent
         */
        _this._dragZoneElem = props.dragElem;

        /**
         * Сам элемент аватара, который будет носиться по экрану.
         * Инициализуется в initFromEvent
         */
        _this._elem = props.dragElem;
        return _this;
    }

    /**
     * Инициализовать this._elem и позиционировать его
     * При необходимости уточнить this._dragZoneElem
     * @param downX Координата X нажатия мыши
     * @param downY Координата Y нажатия мыши
     * @param event Текущее событие мыши
     */


    _createClass(DragAvatar, [{
        key: 'initFromEvent',
        value: function initFromEvent(downX, downY, event) {
            /* override */
            // Отмена переноса если переносимый
            // элемент не содержит класс draggable
            if (event.target.closest('.draggable') === null) return false;

            this._dragZoneElem = event.target;

            var elem = this._elem = this._dragZoneElem.cloneNode(true);

            elem.classList.add('avatar');

            // создать вспомогательные свойства shiftX/shiftY
            var coords = (0, _utils.getCoords)(this._dragZoneElem);

            this._shiftX = downX - coords.left;
            this._shiftY = downY - coords.top;

            // инициировать начало переноса
            document.body.appendChild(elem);
            elem.style.zIndex = 9999;
            elem.style.position = 'absolute';
            // elem.style.display = 'none';

            return true;
        }

        /**
         * Возвращает информацию о переносимом элементе для DropTarget
         * @param event
         */

    }, {
        key: 'getDragInfo',
        value: function getDragInfo(event) {
            // тут может быть еще какая-то информация, необходимая для обработки конца или процесса переноса
            return {
                elem: this._elem,
                dragZoneElem: this._dragZoneElem,
                dragZone: this._dragZone
            };
        }

        /**
         * Возвращает текущий самый глубокий DOM-элемент под this._elem
         * Приватное свойство _currentTargetElem обновляется при каждом передвижении
         */

    }, {
        key: 'getTargetElem',
        value: function getTargetElem() {
            return this._currentTargetElem;
        }
    }, {
        key: 'onDragMove',


        /**
         * При каждом движении мыши перемещает this._elem
         * и записывает текущий элемент под this._elem в _currentTargetElem
         * @param event
         */
        value: function onDragMove(event) {
            this._elem.style.left = event.pageX - this._shiftX + 'px';
            this._elem.style.top = event.pageY - this._shiftY + 'px';

            this._currentTargetElem = (0, _utils.getElementUnderClientXY)(this._elem, event.clientX, event.clientY);
        }
    }, {
        key: 'onDragCancel',


        /**
         * Действия с аватаром, когда перенос не удался
         * Например, можно вернуть элемент обратно или уничтожить
         */
        value: function onDragCancel() {
            /* override */
            // default behaviour
            this._destroy();
        }
    }, {
        key: 'onDragEnd',


        /**
         * Действия с аватаром после успешного переноса
         */
        value: function onDragEnd() {
            /* override */
            // default behaviour
            this._destroy();
        }
    }, {
        key: '_destroy',
        value: function _destroy() {
            this._elem.parentNode.removeChild(this._elem);
        }
    }]);

    return DragAvatar;
}(_react.Component);

exports.default = DragAvatar;