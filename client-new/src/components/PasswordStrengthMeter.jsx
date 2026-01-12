import { useState, useEffect } from 'react'
import zxcvbn from 'zxcvbn'
import '../styles/PasswordStrengthMeter.css'

export default function PasswordStrengthMeter({ password, showDetails = true }) {
  const [analysis, setAnalysis] = useState(null)

  useEffect(() => {
    if (!password) {
      setAnalysis(null)
      return
    }

    const result = zxcvbn(password)
    setAnalysis({
      score: result.score,
      crackTime: result.crack_times_display.offline_slow_hashing_1e4_per_second,
      feedback: result.feedback,
      strength: getStrengthLabel(result.score)
    })
  }, [password])

  const getStrengthLabel = (score) => {
    const labels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong']
    return labels[score] || 'Unknown'
  }

  const getStrengthColor = (score) => {
    const colors = ['#ff4757', '#ff6b7a', '#ffa502', '#2ed573', '#1dd1a1']
    return colors[score] || '#ddd'
  }

  if (!password || !analysis) {
    return null
  }

  return (
    <div className="password-strength-meter">
      <div className="strength-bar">
        <div className="strength-bar-fill" 
             style={{ 
               width: `${(analysis.score + 1) * 20}%`,
               backgroundColor: getStrengthColor(analysis.score)
             }}>
        </div>
      </div>
      
      <div className="strength-info">
        <span className="strength-label" style={{ color: getStrengthColor(analysis.score) }}>
          {analysis.strength}
        </span>
        <span className="crack-time">
          Time to crack: {analysis.crackTime}
        </span>
      </div>

      {showDetails && (analysis.feedback.warning || analysis.feedback.suggestions.length > 0) && (
        <div className="strength-feedback">
          {analysis.feedback.warning && (
            <div className="feedback-warning">
              ⚠️ {analysis.feedback.warning}
            </div>
          )}
          {analysis.feedback.suggestions.length > 0 && (
            <div className="feedback-suggestions">
              <strong>Suggestions:</strong>
              <ul>
                {analysis.feedback.suggestions.map((suggestion, index) => (
                  <li key={index}>{suggestion}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  )
}