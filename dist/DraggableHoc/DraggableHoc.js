'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _DragAvatar = require('../DragAvatar');

var _DragAvatar2 = _interopRequireDefault(_DragAvatar);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function DraggableHoc(Component) {
    var Draggable = function (_React$Component) {
        _inherits(Draggable, _React$Component);

        function Draggable(props) {
            _classCallCheck(this, Draggable);

            var _this = _possibleConstructorReturn(this, (Draggable.__proto__ || Object.getPrototypeOf(Draggable)).call(this, props));

            _this.setRef = function (el) {
                _this.draggable = el;
            };

            return _this;
        }

        _createClass(Draggable, [{
            key: 'componentDidMount',
            value: function componentDidMount() {
                this.initDragZone();
            }

            /**
             * Инициализация элемента (получение ссылки на DOM - элемент)
             * @param elem DOM-элемент, к которому привязана зона
             */

        }, {
            key: 'initDragZone',
            value: function initDragZone() {
                if (this.draggable) {
                    this.draggable.dragZone = this;
                }
            }

            /**
             * Создать аватар, соответствующий зоне.
             * У разных зон могут быть разные типы аватаров
             */

        }, {
            key: '_makeAvatar',
            value: function _makeAvatar() {
                /* override */
                return new _DragAvatar2.default({
                    dragZone: this,
                    dragElem: this.draggable
                });
            }
        }, {
            key: 'onDragStart',


            /**
             * Обработать начало переноса.
             *
             * Получает координаты изначального нажатия мышки, событие.
             *
             * @param downX Координата изначального нажатия по X
             * @param downY Координата изначального нажатия по Y
             * @param event текущее событие мыши
             *
             * @return аватар или false, если захватить с данной точки ничего нельзя
             */
            value: function onDragStart(downX, downY, event) {

                var avatar = this._makeAvatar();

                if (!avatar.initFromEvent(downX, downY, event)) {
                    return false;
                }

                return avatar;
            }
        }, {
            key: 'render',
            value: function render() {
                return _react2.default.createElement(Component, _extends({}, this.props, {
                    setDraggableRef: this.setRef
                }));
            }
        }]);

        return Draggable;
    }(_react2.default.Component);

    return Draggable;
};

exports.default = DraggableHoc;