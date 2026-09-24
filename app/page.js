'use client';

import { useState } from 'react';
import ReactMarkdown from 'react-markdown';

export default function Home() {
  const [role, setRole] = useState('Rodzic');
  const [problemDescription, setProblemDescription] = useState('');
  const [wordPairInput, setWordPairInput] = useState('');
  const [wordPairs, setWordPairs] = useState([]);
  
  const [generatedPlan, setGeneratedPlan] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleAddWordPair = (e) => {
    e.preventDefault();
    if (wordPairInput.trim()) {
      setWordPairs([...wordPairs, wordPairInput.trim()]);
      setWordPairInput('');
    }
  };

  const handleRemoveWordPair = (indexToRemove) => {
    setWordPairs(wordPairs.filter((_, index) => index !== indexToRemove));
  };

  const handleDownloadPDF = async () => {
    if (typeof window === 'undefined') return;

    const element = document.getElementById('pdf-cards-container');
    if (!element) return;

    try {
      const html2pdfModule = await import('html2pdf.js');
      const html2pdf = html2pdfModule.default || html2pdfModule;

      const opt = {
        margin: [8, 8, 8, 8],
        filename: 'Plan_Terapii_Logopedycznej.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, logging: false },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };

      html2pdf().set(opt).from(element).save();
    } catch (err) {
      console.error('Błąd podczas generowania PDF:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!problemDescription.trim()) return;

    setLoading(true);
    setErrorMessage('');
    
    try {
      // UWAGA: Upewnij się, że ten adres odpowiada Twojej usłudze na Render!
      const response = await fetch('https://TWOJA-NAZWA-APLIKACJI.onrender.com/generate-plan', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          user_id: 'guest',
          role: role,
          problem_description: problemDescription,
          word_pairs: wordPairs
        })
      });

      if (!response.ok) {
        throw new Error(`Błąd serwera: ${response.status}`);
      }

      const data = await response.json();
      let rawText = typeof data === 'string' ? data : (data.generated_plan || JSON.stringify(data));

      // Zamiana formatowania nowej linii
      rawText = rawText.replace(/\\n/g, '\n');

      setGeneratedPlan(rawText);
    } catch (error) {
      console.error('Błąd generowania planu:', error);
      setErrorMessage('Nie udało się połączyć z serwerem. Upewnij się, że podałeś poprawny URL backendu na Render.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ maxWidth: '850px', margin: '40px auto', padding: '0 20px', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      
      {/* FORMULARZ WEJŚCIOWY */}
      <div className="card-box" style={{ marginBottom: '30px' }}>
        <h1 style={{ marginTop: 0, fontSize: '24px', color: '#0f172a' }}>Generator Planu Terapii Logopedycznej</h1>
        <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '24px' }}>
          Wypełnij poniższe pola, aby wygenerować spersonalizowaną kartę diagnozy oraz plan ćwiczeń.
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div>
            <label className="input-label">Rola</label>
            <select 
              value={role} 
              onChange={(e) => setRole(e.target.value)}
              className="form-input"
            >
              <option value="Rodzic">Rodzic</option>
              <option value="Logopeda">Logopeda</option>
            </select>
          </div>

          <div>
            <label className="input-label">Opis problemu</label>
            <textarea 
              rows={4}
              value={problemDescription}
              onChange={(e) => setProblemDescription(e.target.value)}
              placeholder="Opisz zauważone trudności językowe lub wymowę dziecka..."
              required
              className="form-input"
            />
          </div>

          <div>
            <label className="input-label">Pary słów (opcjonalnie)</label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input 
                type="text"
                value={wordPairInput}
                onChange={(e) => setWordPairInput(e.target.value)}
                placeholder="np. Król -> Kjuj"
                className="form-input"
              />
              <button 
                type="button" 
                onClick={handleAddWordPair}
                className="btn-secondary"
              >
                Dodaj parę
              </button>
            </div>

            {wordPairs.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '10px' }}>
                {wordPairs.map((pair, index) => (
                  <span key={index} className="word-chip">
                    {pair}
                    <button type="button" onClick={() => handleRemoveWordPair(index)} className="chip-remove">×</button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {errorMessage && (
            <div style={{ color: '#dc2626', backgroundColor: '#fef2f2', padding: '12px', borderRadius: '6px', fontSize: '14px', border: '1px solid #fecaca' }}>
              {errorMessage}
            </div>
          )}

          <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
            <button 
              type="submit"
              disabled={loading || !problemDescription.trim()}
              className="btn-primary"
            >
              {loading ? 'Generowanie...' : 'Generuj plan'}
            </button>

            {generatedPlan && (
              <button 
                type="button"
                onClick={handleDownloadPDF}
                className="btn-success"
              >
                📄 Pobierz jako PDF
              </button>
            )}
          </div>

        </form>
      </div>

      {/* SEKCJA WYNIKOWA DO DRUKU / ZAPISU PDF */}
      {generatedPlan && (
        <div id="pdf-cards-container" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div className="card-box">
            <div className="card-header">
              <div>
                <span className="badge">Karta Terapii</span>
                <h2 style={{ margin: '8px 0 0 0', fontSize: '20px', color: '#0f172a' }}>
                  Analiza Logopedyczna i Plan Pracy
                </h2>
              </div>
            </div>

            <div className="plan-styled-content">
              <ReactMarkdown>{generatedPlan}</ReactMarkdown>
            </div>
          </div>

          <div style={{ textAlign: 'center', fontSize: '11px', color: '#94a3b8' }}>
            Wygenerowano automatycznie z systemu AI Logopedia
          </div>

        </div>
      )}

      {/* STYLE CSS */}
      <style jsx global>{`
        .card-box {
          background-color: #ffffff;
          padding: 32px;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        }

        .card-header {
          border-bottom: 2px solid #e2e8f0;
          padding-bottom: 16px;
          margin-bottom: 20px;
        }

        .input-label {
          display: block;
          font-size: 13px;
          font-weight: 600;
          color: #475569;
          margin-bottom: 6px;
        }

        .form-input {
          width: 100%;
          padding: 10px 12px;
          border: 1px solid #cbd5e1;
          border-radius: 6px;
          font-size: 14px;
          box-sizing: border-box;
          font-family: inherit;
        }

        .form-input:focus {
          outline: none;
          border-color: #0284c7;
        }

        .btn-primary {
          padding: 12px 24px;
          background-color: #0284c7;
          color: #ffffff;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          font-size: 14px;
        }

        .btn-primary:disabled {
          background-color: #94a3b8;
          cursor: not-allowed;
        }

        .btn-secondary {
          padding: 10px 16px;
          background-color: #f1f5f9;
          color: #334155;
          border: 1px solid #cbd5e1;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 600;
          white-space: nowrap;
        }

        .btn-success {
          padding: 12px 24px;
          background-color: #16a34a;
          color: #ffffff;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          font-size: 14px;
        }

        .word-chip {
          background-color: #e0f2fe;
          color: #0369a1;
          padding: 4px 10px;
          border-radius: 16px;
          font-size: 13px;
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }

        .chip-remove {
          background: none;
          border: none;
          color: #0369a1;
          cursor: pointer;
          font-weight: bold;
          padding: 0;
        }

        .badge {
          background-color: #e0f2fe;
          color: #0369a1;
          font-size: 11px;
          font-weight: 700;
          padding: 4px 8px;
          border-radius: 4px;
          text-transform: uppercase;
        }

        /* Formatowanie wygenerowanej zawartości */
        .plan-styled-content p {
          font-size: 15px;
          line-height: 1.7;
          color: #334155;
          margin-bottom: 16px;
          white-space: pre-wrap;
        }

        .plan-styled-content strong {
          color: #0369a1;
          background-color: #f0f9ff;
          padding: 2px 6px;
          border-radius: 4px;
          font-weight: 700;
        }

        .plan-styled-content h1, 
        .plan-styled-content h2 {
          color: #0f172a;
          font-size: 17px;
          margin-top: 28px;
          margin-bottom: 14px;
          border-left: 4px solid #0284c7;
          padding-left: 10px;
        }

        .plan-styled-content h3 {
          color: #0f172a;
          font-size: 15px;
          margin-top: 20px;
          margin-bottom: 10px;
        }

        .plan-styled-content ul, 
        .plan-styled-content ol {
          margin: 12px 0 20px 20px;
          padding: 0;
        }

        .plan-styled-content li {
          font-size: 14px;
          line-height: 1.6;
          color: #334155;
          margin-bottom: 8px;
        }
      `}</style>

    </main>
  );
}
