import React from 'react';

function DroppableHoc (Component) {
    class Droppable extends React.Component {
        constructor (props) {
            super(props);
        }

        componentDidMount () {
            this.initDropTarget();
        }

        /**
         * Инициализация элемента (получение ссылки на DOM - элемент)
         * @param elem DOM-элемент, к которому привязана зона
         */
        initDropTarget () {
            if (this.droppable) {
                this.droppable.dropTarget = this;
                this._targetElem = null;
            }
        };

        /**
         * Возвращает DOM-подэлемент, над которым сейчас пролетает аватар
         *
         * @return DOM-элемент, на который можно положить или undefined
         */
        _getTargetElem (avatar, event) {
            let target = avatar.getTargetElem();

            if (!target.closest('.droppable')) {
                return;
            }

            // проверить, может быть перенос узла внутрь самого себя или в себя?
            let elemToMove = avatar.getDragInfo(event).dragZoneElem.parentNode;

            let elem = target;

            while (elem) {
                if (elem === elemToMove) return; // попытка перенести родителя в потомка
                elem = elem.parentNode;
            }

            return target;
        };

        /**
         * Спрятать индикацию переноса
         * Вызывается, когда аватар уходит с текущего this._targetElem
         */
        _hideHoverIndication (avatar) {
        };
        /**
         * Показать индикацию переноса
         * Вызывается, когда аватар пришел на новый this._targetElem
         */
        _showHoverIndication (avatar) {
        };

        /**
         * Метод вызывается при каждом движении аватара
         */
        onDragMove (avatar, event) {
            let newTargetElem = this._getTargetElem(avatar, event);

            if (this._targetElem !== newTargetElem) {
                this._hideHoverIndication(avatar);
                // override element reference
                this.droppable = newTargetElem;
                this._targetElem = newTargetElem;
                this._showHoverIndication(avatar);
            }
        };

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
        onDragEnd(avatar, event) {
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
        };

        /**
         * Вход аватара в DropTarget
         */
        onDragEnter (fromDropTarget, avatar, event) {
            // TODO maybe remove it
            // const coords = event.target.getBoundingClientRect();
            // const Y = coords.top + coords.height / 2;
        };

        /**
         * Выход аватара из DropTarget
         */
        onDragLeave (toDropTarget, avatar, event) {
            this._hideHoverIndication();
            this._targetElem = null;
        };

        setRef = el => {
            this.droppable = el;
        };

        render () {
            return (
                <Component
                    {...this.state}
                    {...this.props}
                    setDroppableRef={this.setRef}
                />
            );
        }
    }

    return Droppable;
}

export default DroppableHoc;
