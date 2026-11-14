import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Wallet, ArrowRight, Lock, Mail } from 'lucide-react';
import { authService } from '../services/authService';

const Login = () => {
  const [email, setEmail] = useState('akarsh@arthik.com');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await authService.login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

 return (
  <div className="login-page">
    {/* Left Branding Section */}
    <section className="login-brand-section">
      <div className="login-brand-content">
        <div className="login-brand">
          <div className="login-brand-icon">
            <Wallet size={23} />
          </div>
          <span>ARTHIK</span>
        </div>

        <div className="login-headline">
          <span className="login-eyebrow">PERSONAL FINANCE, REIMAGINED</span>
          <h1>
            Make your money
            <br />
            work <span>smarter.</span>
          </h1>
          <p>
            One place to understand your spending, build better saving habits,
            and stay in control of your financial future.
          </p>
        </div>

        {/* Decorative financial visual */}
        <div className="login-visual">
          <div className="login-visual-top">
            <span>YOUR FINANCIAL OVERVIEW</span>
            <span className="login-live-indicator">● LIVE VIEW</span>
          </div>

          <div className="login-visual-chart">
            <div className="login-chart-label">
              <span>Financial growth</span>
              <strong>Stay on track</strong>
            </div>

            <div className="login-chart-bars">
              {[35, 49, 42, 65, 54, 76, 68, 91, 78, 100, 86, 96].map((height, index) => (
                <div
                  key={index}
                  className="login-chart-bar"
                  style={{ height: `${height}%` }}
                />
              ))}
            </div>

            <div className="login-chart-months">
              <span>JAN</span>
              <span>MAR</span>
              <span>MAY</span>
              <span>JUL</span>
              <span>SEP</span>
              <span>DEC</span>
            </div>
          </div>

          <div className="login-visual-footer">
            <div>
              <span className="login-footer-dot" />
              <span>Track every transaction</span>
            </div>
            <div>
              <span className="login-footer-dot" />
              <span>Plan with purpose</span>
            </div>
          </div>
        </div>
      </div>

      <div className="login-brand-bottom">
        <span>PERSONAL FINANCE MANAGEMENT</span>
        <span>BUILT FOR BETTER FINANCIAL DECISIONS.</span>
      </div>
    </section>

    {/* Right Login Section */}
    <section className="login-form-section">
      <div className="login-form-container">
        <div className="login-form-heading">
          <span className="login-eyebrow">YOUR ACCOUNT</span>
          <h2>Welcome back.</h2>
          <p>Sign in to continue to your financial dashboard.</p>
        </div>

        {error && (
          <div className="login-error">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="login-form">
          <div className="login-field">
            <label htmlFor="login-email">Email address</label>
            <div className="login-input-wrapper">
              <Mail size={18} />
              <input
                id="login-email"
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="login-field">
            <label htmlFor="login-password">Password</label>
            <div className="login-input-wrapper">
              <Lock size={18} />
              <input
                id="login-password"
                type="password"
                required
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="login-submit-button"
          >
            <span>{loading ? 'Authenticating...' : 'Sign in to ARTHIK'}</span>
            <ArrowRight size={18} />
          </button>
        </form>

        <div className="login-register">
          <span>New to ARTHIK?</span>
          <Link to="/register">Create an account <ArrowRight size={14} /></Link>
        </div>

        <div className="login-demo">
          <div className="login-demo-heading">
            <Lock size={14} />
            <span>DEMO ACCESS</span>
          </div>
          <p>Email: <strong>akarsh@arthik.com</strong></p>
          <p>Password: <strong>password123</strong></p>
        </div>

        <div className="login-security-note">
          <Lock size={13} />
          <span>Your financial information stays protected.</span>
        </div>
      </div>
    </section>
  </div>
);
};

export default Login;
