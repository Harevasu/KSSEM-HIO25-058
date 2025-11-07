interface VeriScoreProps {
  score: number;
}

export default function VeriScore({ score }: VeriScoreProps) {
  const getColor = () => {
    if (score >= 90) return 'text-green-500'
    if (score >= 70) return 'text-amber-500'
    return 'text-red-500'
  }

  const getIcon = () => {
    if (score >= 90) return '✅'
    if (score >= 70) return '⚠️'
    return '❌'
  }

  return (
    <div className={`flex items-center space-x-2 font-bold ${getColor()}`}>
      <span>{getIcon()}</span>
      <span>{score}</span>
    </div>
  )
}
