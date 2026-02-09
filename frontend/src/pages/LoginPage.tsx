/**
 * ============================================
 * ARTIVIO — LOGIN PAGE
 * ============================================
 */

import { useState } from 'react';
import { AuthService } from '../services/auth.service';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function submit() {
    await AuthService.login(email, password);
    window.location.href = '/';
  }

  return (
    <div>
      <h1>Login</h1>
      <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={submit}>Login</button>
    </div>
  );
}