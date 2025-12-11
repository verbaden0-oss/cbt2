import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import client from '../api/client';
import { useAuthStore } from '../store/authStore';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';

export default function Login() {
  const login = useAuthStore((s) => s.login);
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      const res = await client.post('/auth/login', { email, password });
      login(res.data.user, res.data.token);
      navigate('/journal');
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Ошибка входа');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <Card className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-text-primary">Вход / Регистрация</h2>
          <p className="text-text-secondary">Введите email и пароль для входа или создания аккаунта</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Ваш email"
            required
          />
          <Input
            label="Пароль"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Ваш пароль"
            required
          />

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-error text-sm">
              {error === 'Invalid credentials' ? 'Неверный email или пароль' : 'Ошибка входа'}
            </div>
          )}

          <Button type="submit" fullWidth isLoading={isLoading}>
            Войти / Создать аккаунт
          </Button>
        </form>
      </Card>
    </div>
  );
}
