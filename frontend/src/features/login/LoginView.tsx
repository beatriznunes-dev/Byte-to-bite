import { useState } from 'react';
import { api } from '../../services/api';

interface LoginProps {
  onLoginSuccess: () => void;
}

type ViewMode = 'login' | 'register';

export function LoginView({ onLoginSuccess }: LoginProps) {
  const [mode, setMode] = useState<ViewMode>('login');
  const [showPassword, setShowPassword] = useState(false);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');

  const toggleMode = () => {
    setMode(mode === 'login' ? 'register' : 'login');
    setPassword('');
    setConfirmPassword('');
    setShowPassword(false);
  };

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    try {
      const response = await api.post('/auth/login', { 
        email, 
        senha: password 
      });
      const { token } = response.data;
      localStorage.setItem('@ByteToBite:token', token);
      onLoginSuccess();
    } catch (error) {
      alert('Falha no login. Verifique suas credenciais.');
    }
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('As senhas não coincidem!');
      return;
    }
    try {
      await api.post('/usuarios', {
        nome,
        email,
        senha: password,
        telefone,
        role: "USUARIO"
      });
      alert('Cadastro realizado com sucesso!');
      setMode('login');
    } catch (error) {
      alert('Erro ao realizar cadastro.');
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-orange-50 p-4 font-sans">
      <form 
        onSubmit={mode === 'login' ? handleLogin : handleRegister} 
        className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-orange-100"
      >
        <h2 className="text-3xl font-black mb-2 text-orange-600 text-center tracking-tight">
          Byte-to-Bite
        </h2>
        <p className="text-center text-gray-500 mb-8 text-sm font-medium">
          {mode === 'login' ? 'Acesse seu painel operacional' : 'Crie sua conta de acesso'}
        </p>
        
        <div className="space-y-4">
          {mode === 'register' && (
            <div className="animate-in fade-in slide-in-from-top-2 duration-300">
              <label className="block text-xs font-bold uppercase text-gray-400 mb-1 ml-1">Nome Completo</label>
              <input 
                type="text" 
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-gray-800 transition-all"
                value={nome}
                onChange={e => setNome(e.target.value)}
                required
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-bold uppercase text-gray-400 mb-1 ml-1">E-mail</label>
            <input 
              type="email" 
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-gray-800 transition-all"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>

          {mode === 'register' && (
            <div className="animate-in fade-in slide-in-from-top-2 duration-300">
              <label className="block text-xs font-bold uppercase text-gray-400 mb-1 ml-1">Telefone</label>
              <input 
                type="text" 
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-gray-800 transition-all"
                value={telefone}
                onChange={e => setTelefone(e.target.value)}
              />
            </div>
          )}

          {/* Campo Senha */}
          <div className="relative">
            <label className="block text-xs font-bold uppercase text-gray-400 mb-1 ml-1">Senha</label>
            <input 
              type={showPassword ? 'text' : 'password'} 
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-gray-800 transition-all pr-12"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-8 text-gray-400 hover:text-orange-600 transition-colors flex items-center"
            >
              <span className="material-symbols-outlined select-none">
                {showPassword ? 'visibility' : 'visibility_off'}
              </span>
            </button>
          </div>

          {/* Campo Repetir Senha (com Olho também) */}
          {mode === 'register' && (
            <div className="relative animate-in fade-in slide-in-from-top-2 duration-300">
              <label className="block text-xs font-bold uppercase text-gray-400 mb-1 ml-1">Repetir Senha</label>
              <input 
                type={showPassword ? 'text' : 'password'} 
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-gray-800 transition-all pr-12"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-8 text-gray-400 hover:text-orange-600 transition-colors flex items-center"
              >
                <span className="material-symbols-outlined select-none">
                  {showPassword ? 'visibility' : 'visibility_off'}
                </span>
              </button>
            </div>
          )}
        </div>

        <button 
          type="submit"
          className="w-full bg-orange-600 text-white py-4 rounded-xl font-bold hover:bg-orange-700 transition-all shadow-lg shadow-orange-200 mt-8 active:scale-95"
        >
          {mode === 'login' ? 'Entrar' : 'Cadastrar'}
        </button>

        <div className="mt-6 text-center border-t border-gray-100 pt-6">
          <button 
            type="button"
            onClick={toggleMode}
            className="text-sm text-orange-600 font-bold hover:text-orange-800 transition-colors"
          >
            {mode === 'login' ? 'Não tem conta? Crie uma agora' : 'Já tem conta? Voltar ao login'}
          </button>
        </div>
      </form>
    </div>
  );
}