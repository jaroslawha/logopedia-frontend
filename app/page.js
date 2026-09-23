'use client';

import { useState } from 'react';
import ReactMarkdown from 'react-markdown';

export default function PlanPage() {
  const [generatedPlan, setGeneratedPlan] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  // Funkcja pobierająca plik PDF z wygenerowanej karty
  const handleDownloadPDF = async () => {
    const element = document.getElementById('pdf-card');
    if (!element) return;

    // Dynamiczny import biblioteki html2pdf (wymagany przez Next.js)
    const html2pdf = (await import('html2pdf.js')).default;

    const opt = {
      margin: [10, 10, 10, 10],
      filename: 'Plan_Terapii_Logopedycznej.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(element).save();
  };

  // Zapytanie do Twojego backendu na Render
  const handleGeneratePlan = async () => {
    setLoading(true);
    try {
      // PODMIEŃ PONIŻSZY ADRES NA SWÓJ REALNY URL Z RENDER:
      const response = await fetch('https://TWOJA-NAZWA-APLIKACJI.onrender.com/generate-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: 'guest',
          role: 'Rodzic',
          problem_description: 'Dziecko ma trudności z prawidłową wymową głoski R.',
          word_pairs: []
        })
      });

      const data = await response.json();
      setGeneratedPlan(data.generated_plan);
    } catch (error) {
      console.error('Błąd generowania planu:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '40px auto', padding: '0 20px', fontFamily: 'sans-serif' }}>
      
      {/* Pasek akcji z przyciskami */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
        <button 
          onClick={handleGeneratePlan}
          disabled={loading}
          style={{
            padding: '12px 20px',
            backgroundColor: '#0284c7',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '600'
          }}
        >
          {loading ? 'Generowanie...' : 'Generuj Plan'}
        </button>

        {generatedPlan && (
          <button 
            onClick={handleDownloadPDF}
            style={{
              padding: '12px 20px',
              backgroundColor: '#16a34a',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600'
            }}
          >
            📄 Pobierz jako PDF
          </button>
        )}
      </div>

      {/* Karta, która zostaje wyrenderowana na ekranie i zapisana do PDF */}
      {generatedPlan && (
        <div 
          id="pdf-card"
          style={{
            backgroundColor: '#ffffff',
            padding: '35px',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            color: '#1e293b'
          }}
        >
          <div style={{ borderBottom: '3px solid #0284c7', paddingBottom: '12px', marginBottom: '20px' }}>
            <h1 style={{ margin: 0, fontSize: '22px', color: '#0f172a' }}>Plan Terapii Logopedycznej</h1>
            <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#64748b' }}>Dokument Edukacyjno-Terapeutyczny</p>
          </div>

          <div className="plan-styled-content">
            <ReactMarkdown>{generatedPlan}</ReactMarkdown>
          </div>

          <div style={{ marginTop: '30px', paddingTop: '10px', borderTop: '1px solid #e2e8f0', textAlign: 'center', fontSize: '11px', color: '#94a3b8' }}>
            Wygenerowano automatycznie z aplikacji Logopedia AI
          </div>
        </div>
      )}

      {/* Style CSS dla sekcji wynikowej */}
      <style jsx global>{`
        .plan-styled-content h2 {
          color: #0f172a;
          font-size: 17px;
          border-left: 4px solid #0284c7;
          padding-left: 10px;
          margin-top: 24px;
          margin-bottom: 12px;
        }
        .plan-styled-content h3 {
          color: #0369a1;
          font-size: 14px;
          background-color: #f0f9ff;
          padding: 8px 12px;
          border-radius: 6px;
          margin-top: 16px;
          margin-bottom: 8px;
        }
        .plan-styled-content ul {
          padding-left: 20px;
          margin: 8px 0;
        }
        .plan-styled-content li {
          margin-bottom: 4px;
          line-height: 1.5;
        }
        .plan-styled-content blockquote {
          background-color: #eff6ff;
          border: 1px solid #bfdbfe;
          border-left: 4px solid #2563eb;
          margin-top: 24px;
          padding: 12px;
          border-radius: 6px;
          font-size: 12px;
          color: #1e40af;
        }
      `}</style>

    </div>
  );
}
