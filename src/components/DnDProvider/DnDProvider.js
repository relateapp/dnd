import React, {Component} from 'react';
import PropTypes from 'prop-types';

class DnDProvider extends Component {

    static propTypes = {
        onDragEnd:    PropTypes.func.isRequired,
        onDragMove:   PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);

        this.state = {
            dragZone:   null,
            dropTarget: null,
            avatar:     null,
            downX:      0,
            downY:      0
        };

        this.onDragStart = this.onDragStart.bind(this);
        this.onMouseMove = this.onMouseMove.bind(this);
        this.onMouseUp = this.onMouseUp.bind(this);
        this.onMouseDown = this.onMouseDown.bind(this);
    }

    componentDidMount() {
        document.addEventListener('dragstart', this.onDragStart);
        document.addEventListener('mousemove', this.onMouseMove);
        document.addEventListener('mouseup', this.onMouseUp);
        document.addEventListener('mousedown', this.onMouseDown);
    }

    componentWillUnmount() {
        document.removeEventListener('dragstart', this.onDragStart);
        document.removeEventListener('mousemove', this.onMouseMove);
        document.removeEventListener('mouseup', this.onMouseUp);
        document.removeEventListener('mousedown', this.onMouseDown);
    }

    onDragStart() {
        return false;
    }

    onMouseDown(e) {
        if (e.which !== 1) {
            // не левой кнопкой
            return;
        }

        const dragZone = this.findDragZone(e);

        if (!dragZone) {
            return;
        } else {
            this.setState({dragZone});
        }

        // запомним, что элемент нажат на текущих координатах pageX/pageY
        this.setState({
            downX: e.pageX,
            downY: e.pageY
        });
    }

    onMouseMove(event) {
        const { onDragMove } = this.props;
        let {dragZone, downX, downY, avatar, dropTarget} = this.state;

        if (!dragZone) return; // элемент не зажат

        if (!avatar) {
            // элемент нажат, но пока не начали его двигать
            if (
                Math.abs(event.pageX - downX) < 3
                && Math.abs(event.pageY - downY) < 3
            ) {
                return;
            }
            // попробовать захватить элемент
            avatar = dragZone.onDragStart(downX, downY, event);

            if (!avatar) {
                // не получилось, значит перенос продолжать нельзя
                this.cleanUp(); // очистить приватные переменные, связанные с переносом
            } else {
                this.setState({avatar});
            }

            return this;
        }

        // отобразить перенос объекта, перевычислить текущий элемент под курсором
        avatar.onDragMove(event);

        // найти новый dropTarget под курсором: newDropTarget
        // текущий dropTarget остался от прошлого mousemove
        // *оба значения: и newDropTarget и dropTarget могут быть null
        let newDropTarget = this.findDropTarget(event);

        if (newDropTarget !== dropTarget) {
            // уведомить старую и новую зоны-цели о том, что с них ушли/на них зашли
            dropTarget && dropTarget.onDragLeave(newDropTarget, avatar, event);
            newDropTarget && newDropTarget.onDragEnter(dropTarget, avatar, event);
        }

        // dropTarget = newDropTarget;
        this.setState({dropTarget: newDropTarget});
        // TODO optimize this function
        if (dropTarget && dropTarget.droppable) {
            onDragMove(event, null, dropTarget);
            dropTarget.onDragMove(avatar, event);
        }

        return false;
    }

    onMouseUp(event) {
        const {onDragEnd} = this.props;
        const {avatar, dragZone, dropTarget} = this.state;

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
                        const draggableId = dragZone
                            .draggable
                            .closest('.draggable')
                            .dataset
                            .draggableId;
                        const droppableId = dropTarget
                            .droppable
                            .closest('.droppable')
                            .dataset.droppableId;

                        onDragEnd(event, draggableId, droppableId);
                    }
                }
            } else {
                avatar.onDragCancel();
            }
        }

        this.cleanUp();
    }

    cleanUp() {
        // очистить все промежуточные объекты
        this.setState({
            avatar:     null,
            dragZone:   null,
            dropTarget: null
        });
    }

    findDragZone(event) {
        let elem = event.target;

        while (elem !== document && !elem.dragZone) {
            elem = elem.parentNode;
        }

        return elem.dragZone;
    }

    findDropTarget(event) {
        // получить элемент под аватаром
        let elem = this.state.avatar.getTargetElem();

        while (elem !== document && !elem.dropTarget) {
            elem = elem.parentNode;
        }

        if (!elem.dropTarget) {
            return null;
        }

        return elem.dropTarget;
    }

    render() {
        return (
            <React.Fragment>
                {this.props.children}
            </React.Fragment>
        );
    }
}

export default DnDProvider;
