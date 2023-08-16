const ScoreBoard = ({ score }) => {
  return (
    <div>
      <h3 className="score-header">Score:</h3>
      <h2>{score}</h2>
    </div>
  )
}

export default ScoreBoard 