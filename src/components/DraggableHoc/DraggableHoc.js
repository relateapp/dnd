import React from 'react';
import DragAvatar from '../DragAvatar';

function DraggableHoc(Component) {
    class Draggable extends React.Component {
        constructor(props) {
            super(props);
        }

        componentDidMount() {
            this.initDragZone();
        }

        /**
         * Инициализация элемента (получение ссылки на DOM - элемент)
         * @param elem DOM-элемент, к которому привязана зона
         */
        initDragZone() {
            if (this.draggable) {
                this.draggable.dragZone = this;
            }
        }

        /**
         * Создать аватар, соответствующий зоне.
         * У разных зон могут быть разные типы аватаров
         */
        _makeAvatar() {
            /* override */
            return new DragAvatar({
                dragZone: this,
                dragElem: this.draggable
            });
        };

        /**
         * Обработать начало переноса.
         *
         * Получает координаты изначального нажатия мышки, событие.
         *
         * @param downX Координата изначального нажатия по X
         * @param downY Координата изначального нажатия по Y
         * @param event текущее событие мыши
         *
         * @return аватар или null, если захватить с данной точки ничего нельзя
         */
        onDragStart(downX, downY, event) {

            const avatar = this._makeAvatar();

            if (!avatar.initFromEvent(downX, downY, event)) {
                return null;
            }

            return avatar;
        };

        setRef = el => {
            this.draggable = el;
        };

        render() {
            return (
                <Component
                    {...this.props}
                    setDraggableRef={this.setRef}
                />
            );
        }
    }

    return Draggable;
};

export default DraggableHoc;
