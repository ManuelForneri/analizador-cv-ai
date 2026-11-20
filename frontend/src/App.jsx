import { useState } from 'react'
import { analizarCV } from './api'
import './App.css'

function App() {
  const [mode, setMode] = useState('text') // 'text' | 'file'
  const [cvText, setCvText] = useState('')
  const [ofertaText, setOfertaText] = useState('')
  const [cvFile, setCvFile] = useState(null)
  const [ofertaFile, setOfertaFile] = useState(null)
  const [status, setStatus] = useState('idle') // 'idle' | 'loading' | 'error' | 'done'
  const [errorMsg, setErrorMsg] = useState('')
  const [result, setResult] = useState(null)

  const canSubmit =
    mode === 'text'
      ? cvText.trim() && ofertaText.trim()
      : cvFile && ofertaFile

  async function handleSubmit(e) {
    e.preventDefault()
    if (!canSubmit || status === 'loading') return

    setStatus('loading')
    setErrorMsg('')

    try {
      const data = await analizarCV({ mode, cvText, ofertaText, cvFile, ofertaFile })
      setResult(data)
      setStatus('done')
    } catch (err) {
      setErrorMsg(
        err.message.includes('fetch')
          ? 'No se pudo conectar con el backend. ¿Está corriendo en http://localhost:8000?'
          : err.message,
      )
      setStatus('error')
    }
  }

  return (
    <div className="page">
      <header className="header">
        <h1>Analizador de CV con IA</h1>
        <p>Pegá tu CV y la oferta laboral (o subí los archivos) para ver qué tan compatibles son.</p>
      </header>

      <form className="card form" onSubmit={handleSubmit}>
        <div className="mode-toggle" role="tablist" aria-label="Modo de entrada">
          <button
            type="button"
            className={mode === 'text' ? 'active' : ''}
            onClick={() => setMode('text')}
          >
            Pegar texto
          </button>
          <button
            type="button"
            className={mode === 'file' ? 'active' : ''}
            onClick={() => setMode('file')}
          >
            Subir archivo
          </button>
        </div>

        <div className="fields">
          <div className="field">
            <label htmlFor="cv">CV</label>
            {mode === 'text' ? (
              <textarea
                id="cv"
                placeholder="Pegá acá el texto de tu CV..."
                value={cvText}
                onChange={(e) => setCvText(e.target.value)}
                rows={10}
              />
            ) : (
              <input
                id="cv"
                type="file"
                accept=".txt,.pdf,.doc,.docx"
                onChange={(e) => setCvFile(e.target.files?.[0] ?? null)}
              />
            )}
          </div>

          <div className="field">
            <label htmlFor="oferta">Oferta laboral</label>
            {mode === 'text' ? (
              <textarea
                id="oferta"
                placeholder="Pegá acá el texto de la oferta laboral..."
                value={ofertaText}
                onChange={(e) => setOfertaText(e.target.value)}
                rows={10}
              />
            ) : (
              <input
                id="oferta"
                type="file"
                accept=".txt,.pdf,.doc,.docx"
                onChange={(e) => setOfertaFile(e.target.files?.[0] ?? null)}
              />
            )}
          </div>
        </div>

        <button type="submit" className="submit" disabled={!canSubmit || status === 'loading'}>
          {status === 'loading' ? 'Analizando...' : 'Analizar'}
        </button>

        {status === 'error' && <p className="error-banner">⚠️ {errorMsg}</p>}
      </form>

      {status === 'loading' && (
        <div className="card result-placeholder">
          <p>Analizando compatibilidad con IA, puede tardar unos segundos...</p>
        </div>
      )}

      {status === 'done' && result && <ResultDashboard result={result} />}
    </div>
  )
}

function ResultDashboard({ result }) {
  const pct = Math.max(0, Math.min(100, Number(result.match_pct) || 0))
  const skills = result.skills_faltantes ?? []

  return (
    <section className="card dashboard">
      <div className="match-block">
        <div className="match-number">{pct}%</div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${pct}%` }} />
        </div>
        <p className="match-label">Compatibilidad con la oferta</p>
      </div>

      <div className="skills-block">
        <h2>Skills faltantes</h2>
        {skills.length > 0 ? (
          <ul className="skills-list">
            {skills.map((skill) => (
              <li key={skill}>{skill}</li>
            ))}
          </ul>
        ) : (
          <p className="muted">No se detectaron skills faltantes.</p>
        )}
      </div>

      <div className="suggestion-block">
        <h2>Sugerencia</h2>
        <p>{result.sugerencia}</p>
      </div>
    </section>
  )
}

export default App
