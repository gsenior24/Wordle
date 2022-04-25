import { WORDS } from "./words.js";

document.addEventListener("DOMContentLoaded", () => {
    let guessedWords = [[]];     
    let availableSpace = 1;
    let currentWordIndex = 0;
    //let word = WORDS[Math.floor(Math.random() * WORDS.length)];
    let word = WORDS[currentWordIndex];
    let guessedWordCount = 0;

    initLocalStorage();
    initStatsModal();
    createSquares();

    console.log(word);

    const keys = document.querySelectorAll(".keyboard-row button");

    function initLocalStorage() 
    {
        const storedCurrentWordIndex = window.localStorage.getItem('currentWordIndex');
        if (!storedCurrentWordIndex)
        {
            window.localStorage.setItem('currentWordIndex', currentWordIndex);
        }
        else
        {
            currentWordIndex = Number(storedCurrentWordIndex);
            word = WORDS[currentWordIndex];
        }
    }

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

    function getTileColor(letter, index)
    {
        const isCorrectLetter = word.includes(letter);

        if (!isCorrectLetter)
        {
            return "red";
        }

        const letterInPosition = word.charAt(index);
        const isCorrectPosition = letter === letterInPosition;

        if (isCorrectPosition)
        {
            return "green";
        }

        return "orange";
    }

    function updateWordIndex() 
    {
        window.localStorage.setItem('currentWordIndex', currentWordIndex + 1);
    }

    function submitWord() 
    {
        const currentWordArr = getCurrentWordArr();
        if (currentWordArr.length !== 5)
        {
            window.alert("Please enter a 5 letter word.")
        }
        
        const currentWord = currentWordArr.join('');

        if (!WORDS.includes(currentWord)) 
        {
            window.alert(`${currentWord} is not a valid word!`);
            throw Error;
        }

        const firstLetterId = guessedWordCount * 5 + 1;
        const interval = 200;
        currentWordArr.forEach((letter, index) => {
            setTimeout(() => {
                const tileColor = getTileColor(letter, index);
                const letterId = firstLetterId + index;
                const letterEl = document.getElementById(letterId);
                letterEl.classList.add("animate__flipInX");
                letterEl.style = `background-color:${tileColor};border-color:${tileColor}`;
            }, interval * index);
        });
        
        guessedWordCount += 1;
        
        if (currentWord === word)
        {
            updateWordIndex();
            window.alert("YOU WIN");
        }

        if (guessedWords.length === 6)
        {
            updateWordIndex();
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
            square.classList.add("animate__animated");
            square.setAttribute("id", i + 1);
            gameBoard.appendChild(square);
        }
    }

    function deleteLetter()
    {
        const currentWordArr = getCurrentWordArr();

        if (!currentWordArr.length)
        {
            return;
        }

        const removedLetter = currentWordArr.pop();

        guessedWords[guessedWords.length - 1] = currentWordArr;

        const lastLetterEl = document.getElementById(String(availableSpace - 1));

        lastLetterEl.textContent = '';
        availableSpace = availableSpace - 1;
    }

    document.addEventListener("keyup", (e) => {
        let keyPressed = String(e.key);

        if (keyPressed === 'Enter')
            {
                submitWord();
                return;
            }

        if (keyPressed === 'Backspace' && availableSpace !== 1)
        {
            deleteLetter();
            return;
        }

        let letter = keyPressed.match(/[a-z]/gi);
        if(!letter || letter.length > 1)
        {
            return;
        }
        else
        {
            updateGuessedWords(letter);
        }
    });

    function updateTotalGames()
    {
        const totalGames = window.localStorage.getItem('totalGames') || 0;
        window.localStorage.setItem('totalGames', Number(totalGames) + 1);
    }

    function showResult()
    {
        const finalResultEl = document.getElementById("final-score");
        finalResultEl.textContent = "World 1 - You win!";

        const totalWins = window.localStorage.getItem('totalWins') || 0;
        window.localStorage.setItem('totalWins', Number(totalWins) + 1);

        const currentStreak = window.localStorage.getItem('currentStreak') || 0;
        window.localStorage.setItem('currentStreak', Number(currentStreak) + 1);
    }

    function showLosingResult()
    {
        const finalResultEl = document.getElementById("final-score");
        finalResultEl.textContent = `Wordle 1 - Failed. Word was ${word}`;

        window.localStorage.setItem("currentStreak", 0);
    }

    function updateStatsModal()
    {
        const currentStreak = window.localStorage.getItem("currentStreak");
        const totalWins = window.localStorage.getItem("totalWins");
        const totalGames = window.localStorage.getItem("totalGames");

        document.getElementById('total-played').textContent = totalGames;
        document.getElementById('total-wins').textContent = totalWins;
        document.getElementById('current-streak').textContent = currentStreak;

        const winPct = Math.round((totalWins / totalGames) * 100) || 0;
        document.getElementById('win-pct').textContent = winPct;
    }

    function initStatsModal()
    {
        const modal = document.getElementById("stats-modal");
        
        const btn = document.getElementById("stats");

        const span = document.getElementById("close-stats");

        btn.addEventListener("click", function() {
            updateStatsModal();
            modal.style.display = "block";
        });

        span.addEventListener("click", function() {
            modal.style.display = "none";
        });

        window.addEventListener("click", function (event) {
            if (event.target == modal) 
            {
                modal.style.display = "none";
            }
        });
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

            if (letter === 'del')
            {
                deleteLetter();
                return;
            }

            updateGuessedWords(letter);
        };
    }
})