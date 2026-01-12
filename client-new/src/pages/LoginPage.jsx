import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import '../styles/Auth.css'

export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [retryAfter, setRetryAfter] = useState(null)
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            })

            const data = await response.json()

            if (!response.ok) {
                setError(data.message || 'Login failed')

                if (data.retryAfter) {
                    setRetryAfter(data.retryAfter)
                }

                return
            }

            if (!data.userId || !data.token) {
                return
            }

            localStorage.setItem('userId', data.userId)
            localStorage.setItem('token', data.token)

            navigate('/passwords')


        } catch (err) {
            setError('Connection error. Please try again.')
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
      if (retryAfter === null) return

      const interval = setInterval(() => {
        setRetryAfter(prev => {
          if (prev <= 1) {
           clearInterval(interval)
           setRetryAfter(null)
           setError('') 
            return null
          }
          return prev - 1
        })
      }, 1000)

     return () => clearInterval(interval)
    }, [retryAfter])

    function formatTime(seconds) {
      const minutes = Math.floor(seconds / 60)
      const secs = seconds % 60
      return `${minutes}:${secs}`
    }

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h1>🔐 Login</h1>
                <p className="auth-subtitle">Welcome back to your password manager</p>

                {error && (
                  <div className="error-message">
                    {error} {retryAfter !== null && `try again in ${formatTime(retryAfter)}.`}
                 </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            id="email"
                            type="email"
                            placeholder="your@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            id="password"
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="btn btn-primary" disabled={loading || retryAfter !== null}>
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>

                <p className="auth-footer">
                    Don't have an account? <Link to="/register">Register here</Link>
                </p>
            </div>
        </div>
    )
}
