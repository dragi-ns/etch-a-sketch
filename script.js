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

    const FADE_IN = [
        { opacity: 0 },
        { opacity: 1 },
    ];
    const FADE_IN_TIMING = {
        duration: 100,
        fill: 'forwards',
    };

    function loadLogo() {
        const chars = document.querySelectorAll('.char');
        const charsMarkedBoxes = Array.from(chars).map(generateChar);
        charsMarkedBoxes.forEach(fadeInChar);
    }

    function generateChar(char) {
        const markedBoxes = [];
        const charTable = CHARS_TABLE[char.dataset.char.toUpperCase()];
        // eslint-disable-next-line no-restricted-syntax
        for (const row of charTable) {
            // eslint-disable-next-line no-restricted-syntax
            for (const column of row) {
                const box = document.createElement('span');
                box.classList.add('box');
                if (column) {
                    box.classList.add('marked');
                    markedBoxes.push(box);
                }
                char.appendChild(box);
            }
        }
        return markedBoxes;
    }

    async function fadeInChar(charMarkedBoxes) {
        // eslint-disable-next-line no-restricted-syntax
        for (const markedBox of charMarkedBoxes) {
            // Wait for an animation to finish before moving to the next markedBox
            // eslint-disable-next-line no-await-in-loop
            await markedBox.animate(FADE_IN, FADE_IN_TIMING).finished;
        }
    }

    loadLogo();
}());
