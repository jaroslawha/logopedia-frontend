// src/lib/api.ts

// Pobieramy adres z Vercela / pliku .env.local
// Jeśli zmienna nie istnieje, domyślnie używamy lokalnego backendu
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

/**
 * Funkcja wysyłająca dane do generowania planu logopedycznego
 */
export async function generateTherapyPlan(payload: {
  child_name?: string;
  age?: number;
  diagnosis?: string;
  notes?: string;
}) {
  const response = await fetch(`${API_BASE_URL}/generate-plan`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `Błąd serwera: ${response.status}`);
  }

  return await response.json();
}
