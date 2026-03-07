import './globals.css'

export const metadata = {
  title: 'Portfolio Manager',
  description: 'Gerencie seus investimentos',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className="bg-black text-white">{children}</body>
    </html>
  )
}