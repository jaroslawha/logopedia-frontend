'use client';
import { useState } from 'react';

export default function Home() {
  const [role, setRole] = useState('Rodzic/opiekun');
  const [problem, setProblem] = useState('');
  const [wordPairs, setWordPairs] = useState([
    { correct: '', incorrect: '' },
    { correct: '', incorrect: '' },
    { correct: '', incorrect: '' }
  ]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  // ZMIENIAJ PONIŻSZY LINK NA SWÓJ LINK Z RENDERA:
  const API_URL = "https://logopedia-api.onrender.com/";

  const handlePairChange = (index, field, value) => {
    const newPairs = [...wordPairs];
    newPairs[index][field] = value;
    setWordPairs(newPairs);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: 'guest',
          role: role,
          problem_description: problem,
          word_pairs: wordPairs
        })
      });

      const data = await res.json();
      if (res.ok) {
        setResult(data.generated_plan);
      } else {
        alert("Błąd: " + (data.detail || "Nie udało się wygenerować planu."));
      }
    } catch (err) {
      alert("Błąd połączenia z serwerem.");
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = () => {
    import('html2pdf.js').then((html2pdf) => {
      const element = document.getElementById('plan-content');
      html2pdf.default().from(element).save('plan_cwiczen_logopedycznych.pdf');
    });
  };

  return (
    <main className="max-w-2xl mx-auto p-4 sm:p-6">
      <header className="text-center my-6">
        <h1 className="text-3xl font-bold text-blue-600">Asystent Logopedyczny AI</h1>
        <p className="text-slate-600 text-sm mt-1">Stwórz spersonalizowany plan ćwiczeń w kilka sekund</p>
      </header>

      <div className="bg-white p-6 rounded-xl shadow-md border border-blue-100">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Kim jesteś? *</label>
            <select 
              value={role} 
              onChange={(e) => setRole(e.target.value)}
              className="w-full p-2.5 bg-blue-50/50 border border-blue-200 rounded-lg text-slate-800 focus:ring-2 focus:ring-blue-500"
            >
              <option value="Rodzic/opiekun">Rodzic/opiekun</option>
              <option value="Logopeda/specjalista">Logopeda/specjalista</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Opis problemu *</label>
            <textarea
              required
              rows="3"
              value={problem}
              onChange={(e) => setProblem(e.target.value)}
              placeholder="Opisz wadę wymowy lub trudności dziecka..."
              className="w-full p-2.5 bg-blue-50/50 border border-blue-200 rounded-lg text-slate-800 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Przykłady wymowy (opcjonalnie)</label>
            {wordPairs.map((pair, idx) => (
              <div key={idx} className="flex gap-2 mb-2">
                <input
                  type="text"
                  placeholder="Słowo poprawne (np. król)"
                  value={pair.correct}
                  onChange={(e) => handlePairChange(idx, 'correct', e.target.value)}
                  className="w-1/2 p-2 bg-slate-50 border border-slate-200 rounded-lg text-sm"
                />
                <input
                  type="text"
                  placeholder="Jak wymawia (np. kjuj)"
                  value={pair.incorrect}
                  onChange={(e) => handlePairChange(idx, 'incorrect', e.target.value)}
                  className="w-1/2 p-2 bg-slate-50 border border-slate-200 rounded-lg text-sm"
                />
              </div>
            ))}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg shadow transition"
          >
            {loading ? 'Generowanie planu przez AI...' : 'Wygeneruj plan ćwiczeń'}
          </button>
        </form>
      </div>

      {result && (
        <div className="mt-8 bg-white p-6 rounded-xl shadow-md border border-slate-200">
          <div id="plan-content" className="prose text-slate-800 whitespace-pre-wrap">
            {result}
          </div>
          
          <div className="mt-6 flex gap-3">
            <button
              onClick={downloadPDF}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-2.5 rounded-lg text-center shadow"
            >
              Pobierz jako PDF
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
