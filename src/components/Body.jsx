import { languages } from "./languages"
import { useState } from "react"
import { clsx } from 'clsx'
import { getFarewellText, randomWords } from "./utils"
import Confetti from "react-confetti"

export default function Body(){
    // State Values
    const [currentWord, setCurrentWord] = useState(() => (randomWords()))
    const [guessedLetter, setGuessedLetter] = useState([])
    
    //Derived Values
    const wrongGuessCount = guessedLetter.filter(
        letter => !currentWord.includes(letter)).length
    const isGameWon = 
        currentWord.split("").every(letter => guessedLetter.includes(letter))
    const isGameLost = wrongGuessCount >= languages.length -1
    const isGameOver = isGameWon || isGameLost
    const lastGuessedLetter = guessedLetter[guessedLetter.length - 1]
    const isLastGuessIncorrect = lastGuessedLetter && !currentWord.includes(lastGuessedLetter)
    
    //Stati Values
    const alphabet = "abcdefghijklmnopqrstuvwxyz"

    //Functions
    function addGuessedLetter(letter){
        setGuessedLetter(prevLetter => 
            prevLetter.includes(letter) ? 
            prevLetter : [...prevLetter, letter]
    )}

    function startNewGame(){
        setCurrentWord(randomWords())
        setGuessedLetter([])
    }

    const languageElement= languages.map((lang, index) => {
        const isLanguageLost = index < wrongGuessCount
        const styles={
            backgroundColor:lang.backgroundColor,
            color: lang.color
        }
        const className = clsx("chip", isLanguageLost && "lost")
        return(
            <span 
                className={className}
                key={lang.id} 
                style={styles}
            >
                {lang.name}
            </span>
        )
    })

    const letterElement = currentWord.split("").map((letter, index) => 
        { const shouldRevealLetter = isGameLost || guessedLetter.includes(letter)
          const letterClassName = clsx(isGameLost && !guessedLetter.includes(letter) && "missed-letters")
        return(
        <span key={index} className={letterClassName}>
            {shouldRevealLetter ?
            letter.toUpperCase() : ""}
        </span>
        )})
    
    const keyboardElement = alphabet.split("").map(letter => {
        const isGuessed = guessedLetter.includes(letter)
        const isCorrect = isGuessed && currentWord.includes(letter)
        const isWrong = isGuessed && !currentWord.includes(letter)
        const className = clsx({
            correct: isCorrect,
            wrong: isWrong
        })

        return(
            <button 
                className={className}
                key={letter}
                disabled={isGameOver} 
                onClick={() => addGuessedLetter(letter)}
            >
                {letter.toUpperCase()}
            </button>
    )})

    const gameStatusClass = clsx("status", {
        won: isGameWon,
        lost:isGameLost,
        farewell:!isGameOver && isLastGuessIncorrect
    })

    function renderGameStatus(){
        if(!isGameOver && isLastGuessIncorrect)
            {
                return (
                <p className="farewell-message">    
                    {getFarewellText(languages[wrongGuessCount - 1].name)}
                </p>
            )}
        if(isGameWon){
            return (
                <>
                    <h2>You win!</h2>
                    <p>Well done! 🎊</p>
                </>
            )
        }
        if(isGameLost) {
            return(
                <>
                    <h2>Game over!</h2>
                    <p>You lost! Better start learning Assembly ☠️</p>
                </>
            )
        }
    }

    return(
        <main>
            {
                isGameWon && <Confetti
                                recycle={false}
                                numberOfPieces={1000}
                            />
            }
            <section className={gameStatusClass}>
                {renderGameStatus()}
            </section>

            <section className="language">
                {languageElement}
            </section>
            <section className="word">
                {letterElement}
            </section>
            <section className="keyboard">
                {keyboardElement}
            </section>
                {isGameOver && <button className="new-game" onClick={startNewGame}>New Game</button>}
        </main>
    )
}