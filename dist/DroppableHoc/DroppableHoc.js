'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _utils = require('../utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function DroppableHoc(Component) {
    var Droppable = function (_React$Component) {
        _inherits(Droppable, _React$Component);

        function Droppable(props) {
            _classCallCheck(this, Droppable);

            var _this = _possibleConstructorReturn(this, (Droppable.__proto__ || Object.getPrototypeOf(Droppable)).call(this, props));

            _this.setRef = function (el) {
                _this.droppable = el;
            };

            return _this;
        }

        _createClass(Droppable, [{
            key: 'componentDidMount',
            value: function componentDidMount() {
                this.initDropTarget();
            }

            /**
             * Инициализация элемента (получение ссылки на DOM - элемент)
             * @param elem DOM-элемент, к которому привязана зона
             */

        }, {
            key: 'initDropTarget',
            value: function initDropTarget() {
                if (this.droppable) {
                    this.droppable.dropTarget = this;
                    this.targetElement = null;
                }
            }
        }, {
            key: '_getTargetElem',


            /**
             * Возвращает DOM-подэлемент, над которым сейчас пролетает аватар
             *
             * @return DOM-элемент, на который можно положить или undefined
             */
            value: function _getTargetElem(avatar, event) {
                var target = avatar.getTargetElem();

                if (!target.closest('.droppable')) {
                    return;
                }

                // проверить, может быть перенос узла внутрь самого себя или в себя?
                var elemToMove = avatar.getDragInfo(event).dragZoneElem.parentNode;

                var elem = target;

                while (elem) {
                    if (elem === elemToMove) return; // попытка перенести родителя в потомка
                    elem = elem.parentNode;
                }

                return target;
            }
        }, {
            key: '_hideHoverIndication',


            /**
             * Спрятать индикацию переноса
             * Вызывается, когда аватар уходит с текущего this.targetElement
             */
            value: function _hideHoverIndication(avatar) {}
        }, {
            key: '_showHoverIndication',

            /**
             * Показать индикацию переноса
             * Вызывается, когда аватар пришел на новый this.targetElement
             */
            value: function _showHoverIndication(avatar) {}
        }, {
            key: 'onDragMove',


            /**
             * Метод вызывается при каждом движении аватара
             */
            value: function onDragMove(avatar, event) {
                var newTargetElem = this._getTargetElem(avatar, event);

                if (this.targetElement !== newTargetElem) {
                    this._hideHoverIndication(avatar);
                    // override element reference
                    this.droppable = newTargetElem;
                    this.targetElement = newTargetElem;
                    this._showHoverIndication(avatar);
                }
            }
        }, {
            key: 'onDragEnd',


            /**
             * Завершение переноса.
             * Алгоритм обработки (переопределить функцию и написать в потомке):
             * 1. Получить данные переноса из avatar.getDragInfo()
             * 2. Определить, возможен ли перенос на targetElement (если он есть)
             * 3. Вызвать avatar.onDragEnd() или avatar.onDragCancel()
             *  Если нужно подтвердить перенос запросом на сервер, то avatar.onDragEnd(),
             *  а затем асинхронно, если сервер вернул ошибку, avatar.onDragCancel()
             *  При этом аватар должен уметь "откатываться" после onDragEnd.
             *
             * При любом завершении этого метода нужно (делается ниже):
             *  снять текущую индикацию переноса
             *  обнулить this.targetElement
             */
            value: function onDragEnd(avatar, event, callback) {
                // получить информацию об объекте переноса
                var _avatar$getDragInfo = avatar.getDragInfo(event),
                    dragZone = _avatar$getDragInfo.dragZone;

                var draggableId = (0, _utils.getDraggableId)(dragZone.draggable);

                if (!this.targetElement) {
                    // перенос закончился вне подходящей точки приземления
                    avatar.onDragCancel();
                    // if drag is not successful droppableId equals null
                    callback(event, draggableId, null);
                } else {
                    var droppableId = (0, _utils.getDroppableId)(this.targetElement);

                    callback(event, draggableId, droppableId);
                    // аватар больше не нужен, перенос успешен
                    // удалить аватар
                    this._hideHoverIndication();
                    avatar.onDragEnd();
                    this.targetElement = null;
                }
            }
        }, {
            key: 'onDragEnter',


            /**
             * Вход аватара в DropTarget
             */
            value: function onDragEnter(fromDropTarget, avatar, event) {
                // TODO maybe remove it
                // const coords = event.target.getBoundingClientRect();
                // const Y = coords.top + coords.height / 2;
            }
        }, {
            key: 'onDragLeave',


            /**
             * Выход аватара из DropTarget
             */
            value: function onDragLeave(toDropTarget, avatar, event) {
                this._hideHoverIndication();
                this.targetElement = null;
            }
        }, {
            key: 'render',
            value: function render() {
                return _react2.default.createElement(Component, _extends({}, this.state, this.props, {
                    setDroppableRef: this.setRef
                }));
            }
        }]);

        return Droppable;
    }(_react2.default.Component);

    return Droppable;
}

exports.default = DroppableHoc;