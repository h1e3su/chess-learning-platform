import React from 'react';

const Home: React.FC = () => {
  return (
    <div style={{ padding: '4rem 2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4rem' }}>
        <h2 className="gradient-text" style={{ fontSize: '2rem', letterSpacing: '2px' }}>ChessMaster</h2>
        <div>
          <button className="btn-primary" onClick={() => window.open('http://localhost:8081/swagger-ui/index.html', '_blank')}>
            View User API
          </button>
        </div>
      </nav>

      <header style={{ textAlign: 'center', marginBottom: '5rem' }}>
        <h1 className="gradient-text" style={{ fontSize: '4.5rem', marginBottom: '1rem', lineHeight: 1.1 }}>
          Master the Game of Kings
        </h1>
        <p style={{ fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto', opacity: 0.8 }}>
          Join the ultimate chess platform. Play, learn, and elevate your ELO with our advanced AI-driven analysis.
        </p>
      </header>

      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        <div className="glass-panel animate-float" style={{ animationDelay: '0s' }}>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--primary-color)' }}>♟️ Interactive Puzzles</h3>
          <p>Solve thousands of curated puzzles to sharpen your tactical vision and calculation skills.</p>
        </div>
        
        <div className="glass-panel animate-float" style={{ animationDelay: '1s' }}>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--primary-color)' }}>🧠 AI Game Analysis</h3>
          <p>Get instant feedback on your matches with our Stockfish-powered analysis engine. Find your blunders!</p>
        </div>

        <div className="glass-panel animate-float" style={{ animationDelay: '2s' }}>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--primary-color)' }}>🏆 Global Leaderboard</h3>
          <p>Compete with players worldwide, earn ELO points, and climb the ranks from Novice to Grandmaster.</p>
        </div>
      </section>
    </div>
  );
};

export default Home;
