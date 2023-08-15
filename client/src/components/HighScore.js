const ScoreBoard = ({ score }) => {
  return (
    <div className="score-board score-padding">
      <h3>High Score!</h3>
      <h2>{score}</h2>
    </div>
  )
}

export default ScoreBoard 