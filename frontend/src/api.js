const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

// Contrato esperado del backend (FastAPI):
//
// POST /analizar  -> multipart/form-data
//   Modo texto:  cv_text (string), oferta_text (string)
//   Modo archivo: cv_file (File), oferta_file (File)
//   (siempre se manda UN solo par, según el modo elegido en la UI)
//
// Response 200 (application/json):
//   {
//     "match_pct": number,          // 0-100
//     "skills_faltantes": string[], // lista de skills que faltan
//     "sugerencia": string          // texto libre con la recomendación
//   }
export async function analizarCV({ mode, cvText, ofertaText, cvFile, ofertaFile }) {
  const formData = new FormData()

  if (mode === 'file') {
    formData.append('cv_file', cvFile)
    formData.append('oferta_file', ofertaFile)
  } else {
    formData.append('cv_text', cvText)
    formData.append('oferta_text', ofertaText)
  }

  const response = await fetch(`${API_URL}/analizar`, {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    throw new Error(`El backend respondió con error ${response.status}`)
  }

  return response.json()
}
