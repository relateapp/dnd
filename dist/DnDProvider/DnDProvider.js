'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DnDProvider = function (_Component) {
    _inherits(DnDProvider, _Component);

    function DnDProvider(props) {
        _classCallCheck(this, DnDProvider);

        var _this = _possibleConstructorReturn(this, (DnDProvider.__proto__ || Object.getPrototypeOf(DnDProvider)).call(this, props));

        _this.state = {
            dragZone: null,
            dropTarget: null,
            avatar: null,
            downX: 0,
            downY: 0
        };

        _this.onDragStart = _this.onDragStart.bind(_this);
        _this.onMouseMove = _this.onMouseMove.bind(_this);
        _this.onMouseUp = _this.onMouseUp.bind(_this);
        _this.onMouseDown = _this.onMouseDown.bind(_this);
        return _this;
    }

    _createClass(DnDProvider, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            document.addEventListener('dragstart', this.onDragStart);
            document.addEventListener('mousemove', this.onMouseMove);
            document.addEventListener('mouseup', this.onMouseUp);
            document.addEventListener('mousedown', this.onMouseDown);
        }
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            document.removeEventListener('dragstart', this.onDragStart);
            document.removeEventListener('mousemove', this.onMouseMove);
            document.removeEventListener('mouseup', this.onMouseUp);
            document.removeEventListener('mousedown', this.onMouseDown);
        }
    }, {
        key: 'onDragStart',
        value: function onDragStart() {
            return false;
        }
    }, {
        key: 'onMouseDown',
        value: function onMouseDown(e) {
            if (e.which !== 1) {
                // не левой кнопкой
                return;
            }

            var dragZone = this.findDragZone(e);

            if (!dragZone) {
                return;
            } else {
                this.setState({ dragZone: dragZone });
            }

            // запомним, что элемент нажат на текущих координатах pageX/pageY
            this.setState({
                downX: e.pageX,
                downY: e.pageY
            });
        }
    }, {
        key: 'onMouseMove',
        value: function onMouseMove(event) {
            var onDragMove = this.props.onDragMove;
            var _state = this.state,
                dragZone = _state.dragZone,
                downX = _state.downX,
                downY = _state.downY,
                avatar = _state.avatar,
                dropTarget = _state.dropTarget;


            if (!dragZone) return; // элемент не зажат

            if (!avatar) {
                // элемент нажат, но пока не начали его двигать
                if (Math.abs(event.pageX - downX) < 3 && Math.abs(event.pageY - downY) < 3) {
                    return;
                }
                // попробовать захватить элемент
                avatar = dragZone.onDragStart(downX, downY, event);

                if (!avatar) {
                    // не получилось, значит перенос продолжать нельзя
                    this.cleanUp(); // очистить приватные переменные, связанные с переносом
                } else {
                    this.setState({ avatar: avatar });
                }

                return this;
            }

            // отобразить перенос объекта, перевычислить текущий элемент под курсором
            avatar.onDragMove(event);

            // найти новый dropTarget под курсором: newDropTarget
            // текущий dropTarget остался от прошлого mousemove
            // *оба значения: и newDropTarget и dropTarget могут быть null
            var newDropTarget = this.findDropTarget(event);

            if (newDropTarget !== dropTarget) {
                // уведомить старую и новую зоны-цели о том, что с них ушли/на них зашли
                dropTarget && dropTarget.onDragLeave(newDropTarget, avatar, event);
                newDropTarget && newDropTarget.onDragEnter(dropTarget, avatar, event);
            }

            // dropTarget = newDropTarget;
            this.setState({ dropTarget: newDropTarget });
            // TODO optimize this function
            if (dropTarget && dropTarget.droppable) {
                onDragMove(event, null, dropTarget);
                dropTarget.onDragMove(avatar, event);
            }

            return false;
        }
    }, {
        key: 'onMouseUp',
        value: function onMouseUp(event) {
            var onDragEnd = this.props.onDragEnd;
            var _state2 = this.state,
                avatar = _state2.avatar,
                dragZone = _state2.dragZone,
                dropTarget = _state2.dropTarget;


            if (event.which !== 1) {
                // не левой кнопкой
                return false;
            }

            if (avatar) {
                // если уже начали передвигать
                if (dropTarget) {
                    // завершить перенос и избавиться от аватара, если это нужно
                    // эта функция обязана вызвать avatar.onDragEnd/onDragCancel
                    dropTarget.onDragEnd(avatar, event);

                    if (typeof onDragEnd === 'function') {
                        if (dropTarget.droppable) {
                            var draggableId = dragZone.draggable.closest('.draggable').dataset.draggableId;
                            var droppableId = dropTarget.droppable.closest('.droppable').dataset.droppableId;

                            onDragEnd(event, draggableId, droppableId);
                        }
                    }
                } else {
                    avatar.onDragCancel();
                }
            }

            this.cleanUp();
        }
    }, {
        key: 'cleanUp',
        value: function cleanUp() {
            // очистить все промежуточные объекты
            this.setState({
                avatar: null,
                dragZone: null,
                dropTarget: null
            });
        }
    }, {
        key: 'findDragZone',
        value: function findDragZone(event) {
            var elem = event.target;

            while (elem !== document && !elem.dragZone) {
                elem = elem.parentNode;
            }

            return elem.dragZone;
        }
    }, {
        key: 'findDropTarget',
        value: function findDropTarget(event) {
            // получить элемент под аватаром
            var elem = this.state.avatar.getTargetElem();

            while (elem !== document && !elem.dropTarget) {
                elem = elem.parentNode;
            }

            if (!elem.dropTarget) {
                return null;
            }

            return elem.dropTarget;
        }
    }, {
        key: 'render',
        value: function render() {
            return _react2.default.createElement(
                _react2.default.Fragment,
                null,
                this.props.children
            );
        }
    }]);

    return DnDProvider;
}(_react.Component);

DnDProvider.propTypes = {
    onDragEnd: _propTypes2.default.func.isRequired,
    onDragMove: _propTypes2.default.func.isRequired
};
exports.default = DnDProvider;