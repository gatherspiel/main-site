
//TODO: Make sure player names are unique
export type PlayerScore = {
  name: string
  scoreData: Record<string,string>
}
export type PlayerScoreData = {
  scoreFields: string[],
  playerScores: PlayerScore[]
}