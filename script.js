(function IIFE() {
    const CHARS_TABLE = {
        A: [
            [0, 1, 0],
            [1, 0, 1],
            [1, 1, 1],
            [1, 0, 1],
            [1, 0, 1],
        ],
        C: [
            [1, 1, 1],
            [1, 0, 1],
            [1, 0, 0],
            [1, 0, 1],
            [1, 1, 1],
        ],
        E: [
            [1, 1, 1],
            [1, 0, 0],
            [1, 1, 0],
            [1, 0, 0],
            [1, 1, 1],
        ],
        H: [
            [1, 0, 1],
            [1, 0, 1],
            [1, 1, 1],
            [1, 0, 1],
            [1, 0, 1],
        ],
        K: [
            [1, 0, 1],
            [1, 1, 0],
            [1, 0, 0],
            [1, 1, 0],
            [1, 0, 1],
        ],
        S: [
            [1, 1, 1],
            [1, 0, 0],
            [1, 1, 1],
            [0, 0, 1],
            [1, 1, 1],
        ],
        T: [
            [1, 1, 1],
            [0, 1, 0],
            [0, 1, 0],
            [0, 1, 0],
            [0, 1, 0],
        ],
        '-': [
            [0, 0, 0],
            [0, 0, 0],
            [1, 1, 1],
            [0, 0, 0],
            [0, 0, 0],
        ],
    };

    const FADE_SLIDE_IN = [
        { opacity: 0, transform: 'translate3D(0, -100%, 0)' },
        { opacity: 1, transform: 'translate3D(0, 0, 0)' },
    ];
    const FADE_SLIDE_IN_TIMING = {
        duration: 100,
        fill: 'forwards',
    };

    function loadLogo() {
        const chars = document.querySelectorAll('.char');
        const charsMarkedCells = Array.from(chars).map(generateChar);
        charsMarkedCells.forEach(showChar);
    }

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

    loadLogo();
}());
