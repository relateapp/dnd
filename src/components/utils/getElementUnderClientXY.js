const getElementUnderClientXY = (elem, clientX, clientY) => {
    const display = elem.style.display || '';

    elem.style.display = 'none';

    let target = document.elementFromPoint(clientX, clientY);

    elem.style.display = display;

    if (!target || target === document) { // это бывает при выносе за границы окна
        target = document.body; // поправить значение, чтобы был именно элемент
    }

    return target;
};

export default getElementUnderClientXY;
