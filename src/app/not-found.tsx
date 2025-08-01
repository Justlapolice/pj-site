// Page not-found

'use client'
import { useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';

const existingPages = ['/accueil', '/infocrs', '/organigramme', '/'];

function getClosestMatches(path: string, maxResults = 3) {
  function distance(a: string, b: string) {
    if (a === b) return 0;
    if (!a.length || !b.length) return Math.max(a.length, b.length);
    const matrix = Array(a.length + 1).fill(0).map(() => Array(b.length + 1).fill(0));
    for (let i = 0; i <= a.length; i++) matrix[i][0] = i;
    for (let j = 0; j <= b.length; j++) matrix[0][j] = j;
    for (let i = 1; i <= a.length; i++) {
      for (let j = 1; j <= b.length; j++) {
        matrix[i][j] = Math.min(
          matrix[i - 1][j] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)
        );
      }
    }
    return matrix[a.length][b.length];
  }

  const scored = existingPages.map(page => ({ page, dist: distance(path, page) }));
  scored.sort((a, b) => a.dist - b.dist);
  return scored.filter(s => s.dist <= 5).slice(0, maxResults).map(s => s.page);
}

export default function NotFound() {
  const router = useRouter();
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [dotPos, setDotPos] = useState({ top: 50, left: 50 }); // pourcentage
  const gameAreaRef = useRef<HTMLDivElement>(null);

  // Déplacer le point à une nouvelle position aléatoire dans le jeu
  const moveDot = () => {
    // On laisse une marge pour éviter que le point soit coupé hors cadre (10%)
    const top = Math.random() * 80 + 10;
    const left = Math.random() * 80 + 10;
    setDotPos({ top, left });
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      setSuggestions(getClosestMatches(path));
    }
    moveDot();
  }, []);

  const handleDotClick = () => {
    setScore(score + 2);
    moveDot();
  };

  return (
    <main className="notfound-pro-container" aria-labelledby="notfound-title">
      <section className="pro-card">
        <div className="pro-svg-illustration" aria-hidden="true">
          {/* Illustration SVG minimaliste, institutionnelle */}
          <svg width="84" height="84" viewBox="0 0 84 84" fill="none" xmlns="http://www.w3.org/2000/svg" className="fade-in">
            <rect x="2" y="2" width="80" height="80" rx="16" fill="none" stroke="#2563EB" strokeWidth="2"/>
            <path d="M42 26V46" stroke="#2563EB" strokeWidth="3" strokeLinecap="round"/>
            <circle cx="42" cy="57" r="2.5" fill="#f1f5fa"/>
            <circle cx="42" cy="42" r="32" stroke="#2563EB" strokeWidth="2"/>
          </svg>
        </div>
        <h1 className="pro-title" id="notfound-title">Erreur 404&nbsp;: Ressource introuvable</h1>
        <p className="pro-desc">La ressource ou la page demandée est introuvable.<br/>Veuillez vérifier l’URL saisie ou retourner à la page d’accueil.</p>
        <p className="pro-path">URL : {typeof window !== 'undefined' ? window.location.pathname : ''}</p>
        {suggestions.length > 0 && (
          <nav className="pro-suggestions" aria-label="Suggestions de navigation">
            <span className="pro-sugg-label">Suggestions&nbsp;:</span>
            <ul className="pro-sugg-list">
              {suggestions.map((s) => (
                <li key={s}><a href={s} className="pro-sugg-link">{s}</a></li>
              ))}
            </ul>
          </nav>
        )}
        <button
          className="pro-btn-home"
          onClick={() => router.push('/accueil')}
          autoFocus
          aria-label="Retour à l’accueil"
        >
          Retour à l’accueil
        </button>
      </section>
      <style jsx>{`
        .notfound-pro-container {
          min-height: 100vh;
          background: #0a1120;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Inter', 'Roboto', Arial, sans-serif;
        }
        .pro-card {
          background: #162032;
          border-radius: 18px;
          box-shadow: 0 8px 32px 0 #000a1a66, 0 1.5px 6px 0 #2563eb11;
          padding: 3.5rem 2.5rem 2.5rem 2.5rem;
          max-width: 420px;
          width: 100%;
          text-align: center;
          border: 1.5px solid #23304a;
          animation: fadeInUp 0.7s cubic-bezier(.4,2,.3,1);
        }
        .pro-svg-illustration {
          margin-bottom: 1.7rem;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .fade-in {
          opacity: 0;
          animation: fadeIn 1.2s 0.1s forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(32px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .pro-title {
          font-size: 2.1rem;
          font-weight: 700;
          color: #f1f5fa;
          margin-bottom: 1rem;
          letter-spacing: -0.01em;
        }
        .pro-desc {
          color: #b8c2d6;
          font-size: 1.08rem;
          margin-bottom: 1.4rem;
          line-height: 1.6;
        }
        .pro-path {
          color: #7b8ca6;
          font-size: 0.97rem;
          margin-bottom: 1.7rem;
          word-break: break-all;
        }
        .pro-suggestions {
          margin-bottom: 1.7rem;
          text-align: left;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 0.3rem;
        }
        .pro-sugg-label {
          font-size: 0.97rem;
          color: #6ea8ff;
          font-weight: 500;
          margin-bottom: 0.2rem;
        }
        .pro-sugg-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }
        .pro-sugg-link {
          color: #b8d4ff;
          background: #23304a;
          border-radius: 8px;
          padding: 0.32em 0.9em;
          text-decoration: none;
          font-size: 0.98rem;
          transition: background 0.2s, color 0.2s;
        }
        .pro-sugg-link:hover, .pro-sugg-link:focus {
          background: #2563eb;
          color: #fff;
          outline: none;
        }
        .pro-btn-home {
          margin-top: 0.7rem;
          background: #2563eb;
          color: #fff;
          border: none;
          border-radius: 10px;
          padding: 0.85em 2.2em;
          font-size: 1.08rem;
          font-weight: 600;
          box-shadow: 0 2px 16px #2563eb22;
          cursor: pointer;
          transition: background 0.2s, box-shadow 0.2s;
          outline: 2px solid transparent;
          outline-offset: 2px;
          letter-spacing: 0.01em;
          display: inline-block;
        }
        .pro-btn-home:focus {
          outline: 2px solid #6ea8ff;
          outline-offset: 3px;
          background: #1d4ed8;
        }
        .pro-btn-home:hover {
          background: #1d4ed8;
          box-shadow: 0 4px 20px #2563eb33;
        }
      `}</style>
    </main>
  );
}
