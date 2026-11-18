import { useEffect, useState, type SubmitEvent } from 'react';
import styles from './Login.module.css';
import PageNav from '../components/PageNav';
import { useAuthContext } from '../contexts/AuthContext';
import Button from '../components/Button';
import { useNavigate, useNavigation } from 'react-router';

function Login() {
  const { login, isAuthenticated } = useAuthContext();
  const navigate = useNavigate();

  // PRE-FILL FOR DEV PURPOSES
  const [email, setEmail] = useState('jack@example.com');
  const [password, setPassword] = useState('qwerty');

  function handleLoginSubmit(e: SubmitEvent) {
    e.preventDefault();
    if (!email || !password) {
      console.error('LOGIN CREDENTIALS MISSING!');
      return;
    }
    login(email, password);
  }

  useEffect(() => {
    if (isAuthenticated) navigate('/app', { replace: true });
  }, [isAuthenticated, navigate]);

  return (
    <main className={styles.login}>
      <PageNav />
      <form className={styles.form} onSubmit={handleLoginSubmit}>
        <div className={styles.row}>
          <label htmlFor="email">Email address</label>
          <input
            type="email"
            id="email"
            onChange={e => setEmail(e.target.value)}
            value={email}
          />
        </div>

        <div className={styles.row}>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            onChange={e => setPassword(e.target.value)}
            value={password}
          />
        </div>

        <div>
          <Button variant="primary" type="submit">
            Login
          </Button>
        </div>
      </form>
    </main>
  );
}

export default Login;
