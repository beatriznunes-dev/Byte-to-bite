import { useState } from 'react';
import { api } from '../../services/api';

interface LoginProps {
  onLoginSuccess: () => void;
}

export function LoginView({ onLoginSuccess }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    try {
      // MUDANÇA AQUI: Enviando 'senha' em vez de 'password' para casar com o DTO do backend
      const response = await api.post('/auth/login', { 
        email, 
        senha: password 
      });
      
      const { token } = response.data;

      localStorage.setItem('@ByteToBite:token', token);
      
      onLoginSuccess();
    } catch (error) {
      // O erro 500 do bcrypt agora deve sumir, e cairá aqui apenas se a senha estiver errada (401)
      alert('Falha no login. Verifique suas credenciais.');
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-orange-50">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-orange-600 text-center">ByB - Login</h2>
        
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">E-mail</label>
          <input 
            type="email" 
            className="w-full p-2 border rounded focus:ring-2 focus:ring-orange-500 outline-none text-gray-800"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 mb-2">Senha</label>
          <input 
            type="password" 
            className="w-full p-2 border rounded focus:ring-2 focus:ring-orange-500 outline-none text-gray-800"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </div>

        <button 
          type="submit"
          className="w-full bg-orange-600 text-white py-2 rounded font-bold hover:bg-orange-700 transition"
        >
          Entrar
        </button>
      </form>
    </div>
  );
}