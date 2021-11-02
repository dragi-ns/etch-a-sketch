(function IIFE() {
    // Animated logo
    const CHARS_TABLE = {
        A: [
            [0, 1, 0],
            [1, 0, 1],
            [1, 1, 1],
            [1, 0, 1],
            [1, 0, 1]
        ],
        C: [
            [1, 1, 1],
            [1, 0, 1],
            [1, 0, 0],
            [1, 0, 1],
            [1, 1, 1]
        ],
        E: [
            [1, 1, 1],
            [1, 0, 0],
            [1, 1, 0],
            [1, 0, 0],
            [1, 1, 1]
        ],
        H: [
            [1, 0, 1],
            [1, 0, 1],
            [1, 1, 1],
            [1, 0, 1],
            [1, 0, 1]
        ],
        K: [
            [1, 0, 1],
            [1, 1, 0],
            [1, 0, 0],
            [1, 1, 0],
            [1, 0, 1]
        ],
        S: [
            [1, 1, 1],
            [1, 0, 0],
            [1, 1, 1],
            [0, 0, 1],
            [1, 1, 1]
        ],
        T: [
            [1, 1, 1],
            [0, 1, 0],
            [0, 1, 0],
            [0, 1, 0],
            [0, 1, 0]
        ],
        '-': [
            [0, 0, 0],
            [0, 0, 0],
            [1, 1, 1],
            [0, 0, 0],
            [0, 0, 0]
        ]
    };

    const FADE_SLIDE_IN = [
        { opacity: 0, transform: 'translate3D(0, -100%, 0)' },
        { opacity: 1, transform: 'translate3D(0, 0, 0)' }
    ];
    const FADE_SLIDE_IN_TIMING = {
        duration: 100,
        fill: 'forwards'
    };

    const chars = document.querySelectorAll('.char');
    const charsMarkedCells = Array.from(chars).map(generateChar);
    charsMarkedCells.forEach(showChar);

    // Drawing board
    let gridRows = [];
    let currentGridSize = 16;
    const grid = document.querySelector('.grid');
    generateGrid();
    grid.addEventListener('mouseover', handleDrawing);
    grid.addEventListener('touchmove', handleDrawing);

    const gridSizeInfo = document.querySelector('#grid-size');
    updateGridSizeInfo();

    // Controls
    let currentControl = 'fill-black';
    const controls = document.querySelectorAll('.control button');
    controls.forEach((control) => control.addEventListener('click', handleControl));

    function generateChar(char) {
        const markedCells = [];
        const charTable = CHARS_TABLE[char.dataset.char.toUpperCase()];
        // eslint-disable-next-line no-restricted-syntax
        for (const row of charTable) {
            const rowContainer = document.createElement('div');
            rowContainer.classList.add('row');
            // eslint-disable-next-line no-restricted-syntax
            for (const column of row) {
                const cell = document.createElement('span');
                cell.classList.add('cell');
                if (column) {
                    cell.classList.add('marked');
                    markedCells.push(cell);
                }
                rowContainer.appendChild(cell);
            }
            char.appendChild(rowContainer);
        }
        return markedCells;
    }

    async function showChar(charMarkedBoxes) {
        // eslint-disable-next-line no-restricted-syntax
        for (const markedBox of charMarkedBoxes) {
            // Wait for an animation to finish before moving to the next markedBox
            // eslint-disable-next-line no-await-in-loop
            await markedBox.animate(FADE_SLIDE_IN, FADE_SLIDE_IN_TIMING).finished;
        }
    }

    function generateGrid() {
        if (gridRows.length > 0) {
            gridRows.forEach((gridRow) => gridRow.remove());
            gridRows = [];
        }

        for (let i = 0; i < currentGridSize; ++i) {
            const row = document.createElement('div');
            row.classList.add('row');
            for (let j = 0; j < currentGridSize; ++j) {
                const cell = document.createElement('div');
                cell.classList.add('cell');
                row.appendChild(cell);
            }
            gridRows.push(row);
        }
        grid.append(...gridRows);
    }

    function handleDrawing(event) {
        let target = null;
        if (event.type === 'touchmove') {
            event.preventDefault();
            target = document.elementFromPoint(
                event.changedTouches[0].clientX,
                event.changedTouches[0].clientY
            );

            // If the user starts moving his finger on the grid and
            // move his finger (without lifting) over an animated logo,
            // it will pick up divs with .cell class from an animated logo.
            if (!grid.contains(target)) {
                return;
            }
        } else {
            target = event.target;
        }

        if (!target.classList.contains('cell')) {
            return;
        }

        let fill = null;
        const currentCellColor = target.style.backgroundColor;
        if (currentControl === 'fill-random' && currentCellColor.length === 0) {
            fill = rgbToString(getRandomRgbColor());
        } else if (currentControl === 'eraser') {
            fill = '';
        } else {
            fill = rgbToString(
                darkenRgbColor(parseRgbString(currentCellColor) ?? [255, 255, 255])
            );
        }
        target.style.backgroundColor = fill;
    }

    function handleControl(event) {
        const target = event.currentTarget;
        const action = target.dataset.action.toLowerCase();
        if (action === 'new-grid') {
            newGridAction();
            return;
        }
        clearActiveControls();
        target.classList.add('active');
        currentControl = action;
    }

    function clearActiveControls() {
        const activeControls = document.querySelectorAll('.control button.active');
        activeControls.forEach((activeControl) => activeControl.classList.remove('active'));
    }

    function updateGridSizeInfo() {
        gridSizeInfo.textContent = `${currentGridSize}x${currentGridSize}`;
    }

    function newGridAction() {
        // eslint-disable-next-line no-alert
        let userAnswer = prompt(
            'Enter new grid size [1-100].',
            currentGridSize
        );
        if (userAnswer === null) {
            return;
        }

        userAnswer = Math.floor(+userAnswer);
        if (!Number.isNaN(userAnswer) && userAnswer >= 1 && userAnswer <= 100) {
            if (userAnswer === currentGridSize) {
                clearGridCells();
            } else {
                currentGridSize = userAnswer;
                generateGrid();
                updateGridSizeInfo();
            }
        } else {
            // eslint-disable-next-line no-alert
            alert('Invalid grid size!');
        }
    }

    function clearGridCells() {
        gridRows.forEach((gridRow) => {
            Array.from(gridRow.children).forEach((cell) => {
                cell.style.backgroundColor = '';
            });
        });
    }

    function rgbToString(rgbColor) {
        return `rgb(${rgbColor[0]}, ${rgbColor[1]}, ${rgbColor[2]})`;
    }

    function parseRgbString(rgbColor) {
        const match = rgbColor.match(/^rgb\(\s*([\d]+)\s*,\s*([\d]+)\s*,\s*([\d]+)\s*\)$/);
        if (match === null) {
            return null;
        }
        return match.slice(1).map((intensity) => parseInt(intensity, 10));
    }

    function darkenRgbColor(rgbColor, amount = 26) {
        return rgbColor.map((intensity) => {
            const darkerColor = intensity - amount;
            return darkerColor < 0 ? 0 : darkerColor;
        });
    }

    function getRandomRgbColor() {
        return [
            getRandomNumber(255),
            getRandomNumber(255),
            getRandomNumber(255)
        ];
    }

    function getRandomNumber(maxNumber) {
        return Math.round(Math.random() * maxNumber);
    }
}());
