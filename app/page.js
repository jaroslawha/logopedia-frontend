"use client";

import React, { useState } from "react";

export default function Home() {
  const [formData, setFormData] = useState({
    role: "Rodzic / Opiekun",
    childName: "",
    childAge: "",
    problemDescription: "",
    wordPairs: "",
  });

  const [loading, setLoading] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const MAX_DESCRIPTION_LENGTH = 2000;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);
    setGeneratedPlan(null);

    // Podział par słów po przecinku na tablicę
    const wordPairsArray = formData.wordPairs
      ? formData.wordPairs.split(",").map((item) => item.trim()).filter(Boolean)
      : [];

    const payload = {
      role: formData.role,
      child_name: formData.childName.trim() || "Dziecko",
      child_age: formData.childAge.trim() || "niepodany",
      problem_description: formData.problemDescription,
      word_pairs: wordPairsArray,
    };

    // Pobranie URL backendu ze zmiennej środowiskowej lub domyślny adres Render
    const backendUrl =
      process.env.NEXT_PUBLIC_BACKEND_URL || "https://twoja-nazwa-backendu.onrender.com";

    try {
      const response = await fetch(`${backendUrl}/generate-plan`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.detail || "Wystąpił błąd podczas generowania planu.");
      }

      setGeneratedPlan(data.generated_plan);
    } catch (err) {
      setErrorMessage(err.message || "Coś poszło nie tak. Spróbuj ponownie za chwilę.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white p-6 sm:p-8 rounded-xl shadow-md border border-gray-100">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Generator Planu Terapii Logopedycznej
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Wypełnij poniższe pola, aby otrzymać spersonalizowany plan ćwiczeń oparty na AI.
          </p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* ROLA */}
          <div>
            <label htmlFor="role" className="block text-sm font-semibold text-gray-700 mb-2">
              Kim jesteś?
            </label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-gray-900 bg-white"
            >
              <option value="Rodzic / Opiekun">Rodzic / Opiekun</option>
              <option value="Logopeda / Specjalista">Logopeda / Specjalista</option>
            </select>
          </div>

          {/* IMIĘ I WIEK DZIECKA (DANE NIEWRAŻLIWE) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="childName" className="block text-sm font-semibold text-gray-700 mb-1">
                Tylko imię dziecka (opcjonalnie)
              </label>
              <input
                type="text"
                id="childName"
                name="childName"
                maxLength={50}
                placeholder="Np. Janek"
                value={formData.childName}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
              />
            </div>

            <div>
              <label htmlFor="childAge" className="block text-sm font-semibold text-gray-700 mb-1">
                Wiek dziecka
              </label>
              <input
                type="text"
                id="childAge"
                name="childAge"
                maxLength={30}
                placeholder="Np. 5 lat"
                value={formData.childAge}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
              />
            </div>
          </div>

          {/* OPIS PROBLEMU */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label htmlFor="problemDescription" className="block text-sm font-semibold text-gray-700">
                Opis trudności i wyzwań mowy <span className="text-red-500">*</span>
              </label>
              <span className="text-xs text-gray-400">
                {formData.problemDescription.length}/{MAX_DESCRIPTION_LENGTH} znaków
              </span>
            </div>
            <textarea
              id="problemDescription"
              name="problemDescription"
              required
              rows={5}
              maxLength={MAX_DESCRIPTION_LENGTH}
              placeholder="Opisz, z jakimi głoskami lub wypowiedziami dziecko ma trudność. Np. zamienia 'r' na 'l', opuszcza końcówki wyrazów..."
              value={formData.problemDescription}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
            />
          </div>

          {/* PRZYKŁADOWE PARY SŁÓW */}
          <div>
            <label htmlFor="wordPairs" className="block text-sm font-semibold text-gray-700 mb-1">
              Przykłady błędnej wymowy / słów (rozdziel przecinkami)
            </label>
            <input
              type="text"
              id="wordPairs"
              name="wordPairs"
              placeholder="Np. rynna -> lynna, rak -> lak"
              value={formData.wordPairs}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
            />
          </div>

          {/* INFORMACJA RODO I BEZPIECZEŃSTWO DANYCH */}
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start space-x-3">
            <span className="text-amber-600 text-xl leading-none">🔒</span>
            <p className="text-xs text-amber-900 leading-relaxed">
              <strong>Ochrona prywatności i RODO:</strong> Ze względu na ochronę danych osobowych,{" "}
              <span className="underline font-semibold">nie wprowadzaj nazwiska dziecka</span>, numerów
              PESEL, adresów zamieszkania ani nazwy przedszkola/szkoły. Wystarczy samo imię i wiek.
            </p>
          </div>

          {/* KOMUNIKAT O BŁĘDZIE */}
          {errorMessage && (
            <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
              ⚠️ {errorMessage}
            </div>
          )}

          {/* PRZYCISK WYSYŁANIA */}
          <button
            type="submit"
            disabled={loading || !formData.problemDescription.trim()}
            className="w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-semibold rounded-lg shadow transition-colors flex items-center justify-center space-x-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Generowanie planu...</span>
              </>
            ) : (
              <span>Wygeneruj Plan Terapii</span>
            )}
          </button>
        </form>

        {/* WYNIK GENEROWANIA PLANU */}
        {generatedPlan && (
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Wygenerowany Plan Terapii:</h3>
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 text-gray-800 whitespace-pre-wrap font-sans leading-relaxed text-sm sm:text-base">
              {generatedPlan}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
