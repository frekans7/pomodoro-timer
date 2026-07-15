import type { Phase, Theme } from '../types'
import { PHASE_COLORS } from '../types'

interface NavBarProps {
  phase: Phase
  theme: Theme
  onThemeToggle: () => void
  onSettingsOpen: () => void
  hasNewProduct?: boolean
  onProductsClick?: () => void
}

export default function NavBar({
  phase,
  theme,
  onThemeToggle,
  onSettingsOpen,
  hasNewProduct = false,
  onProductsClick,
}: NavBarProps) {
  const accentColor = PHASE_COLORS[phase]

  return (
    <nav className="navbar" style={{ backgroundColor: accentColor }}>
      <div className="navbar-inner">
        <a className="navbar-brand" href="#" aria-label="Pomodoro Timer">
          {/* Timer icon */}
          <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
            <path d="M15,1H9v2h6V1z M11,14h2V8h-2V14z M19.03,7.39l1.42-1.42
              c-0.43-0.51-0.9-0.99-1.41-1.41l-1.42,1.42C16.07,4.74,14.12,4,12,4
              C7.03,4,3,8.03,3,13s4.02,9,9,9s9-4.03,9-9
              C21,10.88,20.26,8.93,19.03,7.39z M12,20c-3.87,0-7-3.13-7-7
              s3.13-7,7-7s7,3.13,7,7S15.87,20,12,20z"/>
          </svg>
          Pomodoro Timer
        </a>

        <div className="navbar-actions">
          {/* Products link */}
          <a
            className="icon-btn"
            href="https://frekans7.com/products"
            target="_blank"
            rel="noopener noreferrer"
            data-tooltip="Products"
            aria-label="Other Products"
            onClick={onProductsClick}
          >
            <svg 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              aria-hidden="true"
            >
              <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/>
              <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09"/>
              <path d="M9 12a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.4 22.4 0 0 1-4 2z"/>
              <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 .05 5 .05"/>
            </svg>
            {hasNewProduct && <span className="badge-new">New</span>}
          </a>

          {/* GitHub link */}
          <a
            className="icon-btn"
            href="https://github.com/frekans7/pomodoro-timer"
            target="_blank"
            rel="noopener noreferrer"
            data-tooltip="Source Code"
            aria-label="Source Code on GitHub"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 2C6.477 2 2 6.477 2 12c0 4.419 2.865 8.166 6.839 9.489
                .5.092.682-.217.682-.482 0-.237-.009-.868-.013-1.703-2.782.605-3.369-1.341-3.369-1.341
                -.454-1.154-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608
                1.003.07 1.531 1.03 1.531 1.03.891 1.529 2.341 1.088 2.91.832
                .091-.647.349-1.086.635-1.337-2.22-.253-4.555-1.11-4.555-4.943
                0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647
                0 0 .84-.269 2.75 1.025A9.547 9.547 0 0 1 12 6.836a9.56 9.56 0 0
                1 2.504.337c1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1
                2.647.64.699 1.028 1.592 1.028 2.683 0 3.841-2.337 4.687-4.565 4.935
                .359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743
                0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
            </svg>
          </a>

          {/* Theme toggle */}
          <button
            className="icon-btn"
            onClick={onThemeToggle}
            data-tooltip={theme === 'dark' ? 'Switch to Light' : 'Switch to Dark'}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              // Sun icon
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M6.76 4.84l-1.8-1.79-1.41 1.41 1.79 1.79 1.42-1.41zM4 10.5H1v2h3v-2zm9-9.95h-2V3.5h2V.55zm7.45 3.91l-1.41-1.41-1.79 1.79 1.41 1.41 1.79-1.79zm-3.21 13.7l1.79 1.8 1.41-1.41-1.8-1.79-1.4 1.4zM20 10.5v2h3v-2h-3zm-8-5c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm-1 16.95h2V19.5h-2v2.95zm-7.45-3.91l1.41 1.41 1.79-1.8-1.41-1.41-1.79 1.8z"/>
              </svg>
            ) : (
              // Moon icon
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9c0-.46-.04-.92-.1-1.36
                  -.98 1.37-2.58 2.26-4.4 2.26-2.98 0-5.4-2.42-5.4-5.4 0-1.81.89-3.42
                  2.26-4.4-.44-.06-.9-.1-1.36-.1z"/>
              </svg>
            )}
          </button>

          {/* Settings */}
          <button
            className="icon-btn"
            onClick={onSettingsOpen}
            data-tooltip="Settings"
            aria-label="Open settings"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58
                c0.18-0.14,0.23-0.41,0.12-0.61l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96
                c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41h-3.84
                c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33
                c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58
                C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.07,0.94l-2.03,1.58c-0.18,0.14-0.23,0.41-0.12,0.61
                l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54
                c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54
                c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32
                c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z
                M12,15.6c-1.98,0-3.6-1.62-3.6-3.6s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6
                S13.98,15.6,12,15.6z"/>
            </svg>
          </button>
        </div>
      </div>
    </nav>
  )
}
