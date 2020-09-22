'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

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
                    this._targetElem = null;
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
             * Вызывается, когда аватар уходит с текущего this._targetElem
             */
            value: function _hideHoverIndication(avatar) {}
        }, {
            key: '_showHoverIndication',

            /**
             * Показать индикацию переноса
             * Вызывается, когда аватар пришел на новый this._targetElem
             */
            value: function _showHoverIndication(avatar) {}
        }, {
            key: 'onDragMove',


            /**
             * Метод вызывается при каждом движении аватара
             */
            value: function onDragMove(avatar, event) {
                var newTargetElem = this._getTargetElem(avatar, event);

                if (this._targetElem !== newTargetElem) {
                    this._hideHoverIndication(avatar);
                    // override element reference
                    this.droppable = newTargetElem;
                    this._targetElem = newTargetElem;
                    this._showHoverIndication(avatar);
                }
            }
        }, {
            key: 'onDragEnd',


            /**
             * Завершение переноса.
             * Алгоритм обработки (переопределить функцию и написать в потомке):
             * 1. Получить данные переноса из avatar.getDragInfo()
             * 2. Определить, возможен ли перенос на _targetElem (если он есть)
             * 3. Вызвать avatar.onDragEnd() или avatar.onDragCancel()
             *  Если нужно подтвердить перенос запросом на сервер, то avatar.onDragEnd(),
             *  а затем асинхронно, если сервер вернул ошибку, avatar.onDragCancel()
             *  При этом аватар должен уметь "откатываться" после onDragEnd.
             *
             * При любом завершении этого метода нужно (делается ниже):
             *  снять текущую индикацию переноса
             *  обнулить this._targetElem
             */
            value: function onDragEnd(avatar, event) {
                if (!this._targetElem) {
                    // перенос закончился вне подходящей точки приземления
                    avatar.onDragCancel();

                    return;
                }

                this._hideHoverIndication();
                // получить информацию об объекте переноса
                // let avatarInfo = avatar.getDragInfo(event);

                avatar.onDragEnd(); // аватар больше не нужен, перенос успешен

                this._targetElem = null;
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
                this._targetElem = null;
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