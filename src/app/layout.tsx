import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { getCurrentRole, toggleRole, getNickname, setNickname } from "@/lib/actions";

// ... [Geist fonts and metadata omitted for brevity, keeping existing] ...
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Film Archive Club",
  description: "우리들의 영화 저장소",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const role = await getCurrentRole();
  const nickname = await getNickname();

  return (
    <html lang="en">
      <body>
        <div className="container" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
          <header className="responsive-header" style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h1 className="text-gradient" style={{ fontSize: '2rem', fontWeight: 700 }}>Film Archive Club</h1>
              <p style={{ color: 'var(--text-muted)' }}>우리들의 영화 저장소</p>
            </div>
            <nav className="responsive-nav" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <a href="#" className="glass-panel" style={{ padding: '0.5rem 1rem' }}>Calendar</a>
              <a href="#" className="glass-panel" style={{ padding: '0.5rem 1rem' }}>Admin</a>

              {role === 'MEMBER' && (
                <form action={setNickname} style={{ display: 'flex', gap: '0.5rem' }}>
                  <input
                    name="nickname"
                    defaultValue={nickname}
                    placeholder="Enter nickname..."
                    style={{
                      padding: '0.5rem',
                      borderRadius: '6px',
                      background: 'var(--bg-base)',
                      border: '1px solid var(--border-subtle)',
                      color: 'var(--text-base)'
                    }}
                  />
                  <button type="submit" className="glass-panel" style={{ padding: '0.5rem' }}>Save</button>
                </form>
              )}

              <form action={toggleRole}>
                <button type="submit" className="glass-panel" style={{
                  padding: '0.5rem 1rem',
                  cursor: 'pointer',
                  background: role === 'ADMIN' ? 'rgba(99, 102, 241, 0.2)' : 'var(--bg-surface)',
                  color: role === 'ADMIN' ? 'var(--accent-primary)' : 'var(--text-base)',
                  border: role === 'ADMIN' ? '1px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                }}>
                  Role: {role}
                </button>
              </form>
            </nav>
          </header>
          {children}
        </div>
      </body>
    </html>
  );
}
