document.addEventListener("DOMContentLoaded", () => {
    createSquares();

    let guessedWords = [[]];     
    let availableSpace = 1;
    let word = "dairy";

    const keys = document.querySelectorAll(".keyboard-row button");

    function getCurrentWordArr()
    {
        const numberOfGuessedWords = guessedWords.length;
        return guessedWords[numberOfGuessedWords - 1];
    }

    function updateGuessedWords(letter)
    {
        const currentWordArr = getCurrentWordArr()

        if (currentWordArr && currentWordArr.length < 5)
        {
            currentWordArr.push(letter);
            const availableSpaceEl = document.getElementById(String(availableSpace));
            availableSpace = availableSpace + 1;
            availableSpaceEl.textContent = letter;
        }
    }

    function submitWord() 
    {
        const currentWordArr = getCurrentWordArr()
        if (currentWordArr.length !== 5)
        {
            window.alert("Please enter a 5 letter word.")
        }
        
        const currentWord = currentWordArr.join('');
        
        if (currentWord === word)
        {
            window.alert("YOU WIN");
        }

        if (guessedWords.length === 6)
        {
            window.alert(`YOU LOSE, 6 GUESSES USED. Word was ${word}.`)
        }

        guessedWords.push([]);
    }

    function createSquares() {
        const gameBoard = document.getElementById("board")

        for (let i = 0; i < 30; i++)
        {
            let square = document.createElement("div");
            square.classList.add("square");
            square.setAttribute("id", i + 1);
            gameBoard.appendChild(square);
        }
    }

    for (let i = 0; i < keys.length; i++)
    {
        keys[i].onclick = ({ target }) => {
            const letter = target.getAttribute("data-key");

            if (letter === 'enter')
            {
                submitWord();
                return;
            }

            updateGuessedWords(letter);
        };
    }
})