'use client';

import { useState } from 'react';
import ReactMarkdown from 'react-markdown';

export default function PlanPage() {
  const [generatedPlan, setGeneratedPlan] = useState('');
  const [loading, setLoading] = useState(false);

  // Funkcja generowania PDF pobierana wyłącznie w przeglądarce
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
      console.error('Błąd podczas tworzenia pliku PDF:', err);
    }
  };

  // Zapytanie do backendu na Render
  const handleGeneratePlan = async () => {
    setLoading(true);
    try {
      // PODMIEŃ ADRES NA SWÓJ REALNY URL Z RENDER:
      const response = await fetch('https://TWOJA-NAZWA-APLIKACJI.onrender.com/generate-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: 'guest',
          role: 'Rodzic',
          problem_description: 'Dziecko mówi Kjuj zamiast Król.',
          word_pairs: []
        })
      });

      const data = await response.json();
      let rawText = typeof data === 'string' ? data : (data.generated_plan || JSON.stringify(data));

      // Zamiana podwójnych znaków nowej linii z API
      rawText = rawText.replace(/\\n/g, '\n');

      setGeneratedPlan(rawText);
    } catch (error) {
      console.error('Błąd generowania planu:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '850px', margin: '30px auto', padding: '0 20px', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      
      {/* Pasek przycisków */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
        <button 
          onClick={handleGeneratePlan}
          disabled={loading}
          style={{
            padding: '12px 24px',
            backgroundColor: '#0284c7',
            color: '#ffffff',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '15px'
          }}
        >
          {loading ? 'Generowanie...' : 'Generuj Plan Terapii'}
        </button>

        {generatedPlan && (
          <button 
            onClick={handleDownloadPDF}
            style={{
              padding: '12px 24px',
              backgroundColor: '#16a34a',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '15px'
            }}
          >
            📄 Pobierz Raport PDF
          </button>
        )}
      </div>

      {/* Podgląd karty z wygenerowanym tekstem */}
      {generatedPlan && (
        <div id="pdf-cards-container" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div className="card-box">
            <div className="card-header">
              <div>
                <span className="badge">Karta Terapii</span>
                <h1 style={{ margin: '8px 0 0 0', fontSize: '22px', color: '#0f172a' }}>
                  Analiza Logopedyczna i Plan Pracy
                </h1>
              </div>
            </div>

            <div className="plan-styled-content">
              <ReactMarkdown>{generatedPlan}</ReactMarkdown>
            </div>
          </div>

          <div style={{ textAlign: 'center', fontSize: '11px', color: '#94a3b8', marginTop: '8px' }}>
            Wygenerowano automatycznie z systemu AI Logopedia
          </div>

        </div>
      )}

      {/* Style CSS dla wygenerowanych treści */}
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

        .badge {
          background-color: #e0f2fe;
          color: #0369a1;
          font-size: 11px;
          font-weight: 700;
          padding: 4px 8px;
          border-radius: 4px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

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

        .plan-styled-content blockquote {
          background-color: #f8fafc;
          border-left: 4px solid #64748b;
          margin: 20px 0;
          padding: 12px 16px;
          border-radius: 0 8px 8px 0;
          font-size: 13px;
          color: #475569;
        }
      `}</style>

    </div>
  );
}
