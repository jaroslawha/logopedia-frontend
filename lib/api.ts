// src/lib/api.ts

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://logopedia-api.onrender.com';

/**
 * Funkcja wysyłająca dane do generowania planu logopedycznego
 */
export async function generateTherapyPlan(payload: {
  user_id?: string;
  role: string;
  child_name?: string;
  child_age?: string;
  problem_description: str;
  word_pairs?: string[];
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
    throw new Error(errorData.detail || errorData.error || `Błąd serwera: ${response.status}`);
  }

  return await response.json();
}
