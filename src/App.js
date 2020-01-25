import React, { useState, useEffect } from 'react'
import './styles.css'
import axios from 'axios'
import Question from './component/question'

export default () => {
    const [questions, setQuestions] = useState(false)
    const [activeQuestion, setActiveQuestion] = useState(0)
    const [totalQuestions, setTotalQuestions] = useState(0)
    const [showResults, setShowResults] = useState(false)

    useEffect(() => {
        axios
            .get(`https://opentdb.com/api.php?amount=3&category=18`)
            .then((res) => {
                setTotalQuestions(res.data.results.length)
                setQuestions(res.data.results)
            })
    }, [])

    const proceed = (e) => {
        e.preventDefault()
        setActiveQuestion(activeQuestion + 1)
    }
    const back = (e) => {
        e.preventDefault()
        setActiveQuestion(activeQuestion - 1)
    }
    const objectFromFormData = function(formData) {
        var values = {}
        for (var pair of formData.entries()) {
            var key = pair[0]
            var value = pair[1]
            if (values[key]) {
                if (!(values[key] instanceof Array)) {
                    values[key] = new Array(values[key])
                }
                values[key].push(value)
            } else {
                values[key] = value
            }
        }
        return values
    }
    const submit = (e) => {
        e.preventDefault()
        const formData = new FormData(e.target)
        console.log(formData)
        console.log(objectFromFormData(formData))
        setShowResults(true)
    }

    return (
        <div className="App">
            {!showResults && questions && (
                <form onSubmit={submit}>
                    {questions.map((data, i) => {
                        const allAnswers = [
                            {
                                id: 0,
                                answer: data.correct_answer,
                                correct: true
                            }
                        ]
                        data.incorrect_answers.forEach((answer, i) => {
                            allAnswers.push({
                                id: i + 1,
                                answer: answer,
                                correct: false
                            })
                        })
                        return (
                            <Question
                                key={i}
                                name={`q-${i}`}
                                category={data.category}
                                question={data.question}
                                visible={i === activeQuestion}
                                answers={allAnswers}
                            />
                        )
                    })}
                    {activeQuestion > 0 &&
                        activeQuestion + 1 !== totalQuestions && (
                            <button onClick={back}>Previous</button>
                        )}
                    {activeQuestion + 1 < totalQuestions &&
                        activeQuestion + 1 !== totalQuestions && (
                            <button onClick={proceed}>Next</button>
                        )}

                    {activeQuestion + 1 === totalQuestions && (
                        <button type="submit">Submit</button>
                    )}
                </form>
            )}

            {showResults && <p> You got {totalQuestions}</p>}
        </div>
    )
}
