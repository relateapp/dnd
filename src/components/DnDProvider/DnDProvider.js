import React, {Component} from 'react';
import PropTypes from 'prop-types';

class DnDProvider extends Component {

    static propTypes = {
        onDragEnd:    PropTypes.func.isRequired,
        onDragMove:   PropTypes.func
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
    }

    componentDidMount() {
        document.addEventListener('mousemove', this.onMouseMove);
        document.addEventListener('mouseup', this.onMouseUp);
        document.addEventListener('mousedown', this.onMouseDown);
    }

    componentWillUnmount() {
        document.removeEventListener('mousemove', this.onMouseMove);
        document.removeEventListener('mouseup', this.onMouseUp);
        document.removeEventListener('mousedown', this.onMouseDown);
    }

    onMouseDown = event => {
        if (event.which !== 1) {
            // не левой кнопкой
            return;
        }

        const dragZone = this.findDragZone(event);

        if (!dragZone) {
            return;
        } else {
            this.setState({dragZone});
        }

        // запомним, что элемент нажат на текущих координатах pageX/pageY
        this.setState({
            downX: event.pageX,
            downY: event.pageY
        });
    }

    onMouseMove = event => {
        const { onDragMove, onDragStart } = this.props;
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

            if (typeof onDragStart === 'function') {
                onDragStart(event);
            }
            // попробовать захватить элемент
            avatar = dragZone.onDragStart(downX, downY, event);

            if (!avatar) {
                // не получилось, значит перенос продолжать нельзя
                this.cleanUp(); // очистить приватные переменные, связанные с переносом
            } else {
                this.setState({avatar});
            }
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

        this.setState({dropTarget: newDropTarget});
        // dropTarget = newDropTarget;
        // TODO optimize this function
        if (dropTarget) {
            dropTarget.onDragMove(avatar, event);

            if (typeof onDragMove === 'function') {
                onDragMove(event, null, dropTarget);
            }
        }

        return false;
    }

    onMouseUp = event => {
        const {onDragEnd} = this.props;
        const {avatar, dragZone, dropTarget} = this.state;

        if (event.which !== 1) {
            // не левой кнопкой
            return false;
        }

        if (avatar) {
            // если уже начали передвигать
            console.log(dropTarget);
            if (dropTarget) {
                // завершить перенос и избавиться от аватара, если это нужно
                // эта функция обязана вызвать avatar.onDragEnd/onDragCancel
                // TODO use another approach
                dropTarget.onDragEnd(avatar, event, onDragEnd);
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
