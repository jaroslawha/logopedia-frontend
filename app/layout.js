export const metadata = {
  title: 'Asystent Ćwiczeń Logopedycznych',
  description: 'Aplikacja wspomagająca tworzenie planów logopedycznych',
}

export default function RootLayout({ children }) {
  return (
    <html lang="pl">
      <head>
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body className="bg-slate-50 min-h-screen text-slate-800">
        {children}
      </body>
    </html>
  )
}
