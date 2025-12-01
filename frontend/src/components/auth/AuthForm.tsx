'use client';

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/AuthContext';

type AuthMode = 'login' | 'signup';

interface AuthFormProps {
  onSuccess?: () => void;
  initialMode?: AuthMode;
}

export function AuthForm({ onSuccess, initialMode = 'login' }: AuthFormProps) {
  const { t } = useTranslation();
  const { login, signup, error, isLoading } = useAuth();
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: '',
    displayName: '',
  });
  const [formError, setFormError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setFormError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (mode === 'login') {
      const success = await login({
        email: formData.email,
        password: formData.password,
      });
      if (success) {
        onSuccess?.();
      }
    } else {
      if (formData.password.length < 4) {
        setFormError('Password must be at least 4 characters');
        return;
      }
      if (formData.username.length < 3) {
        setFormError('Username must be at least 3 characters');
        return;
      }
      
      const success = await signup({
        email: formData.email,
        password: formData.password,
        username: formData.username,
        displayName: formData.displayName || formData.username,
        preferredLanguage: 'en',
      });
      if (success) {
        onSuccess?.();
      }
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden max-w-md w-full mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-6 text-center">
        <span className="text-5xl block mb-3">🎮</span>
        <h2 className="text-2xl font-bold">
          {mode === 'login' ? t('auth.welcomeBack') : t('auth.createAccount')}
        </h2>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        {mode === 'signup' && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('common.username')}
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                minLength={3}
                maxLength={20}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:ring-0 outline-none transition-colors"
                placeholder="coolkid123"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Display Name
              </label>
              <input
                type="text"
                name="displayName"
                value={formData.displayName}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:ring-0 outline-none transition-colors"
                placeholder="Alex"
              />
            </div>
          </>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t('common.email')}
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:ring-0 outline-none transition-colors"
            placeholder="your@email.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t('common.password')}
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            minLength={4}
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:ring-0 outline-none transition-colors"
            placeholder="••••••"
          />
          {mode === 'signup' && (
            <p className="text-xs text-gray-500 mt-1">
              At least 4 characters. Keep it simple! 😊
            </p>
          )}
        </div>

        {/* Error message */}
        {(error || formError) && (
          <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm">
            ⚠️ {error || formError}
          </div>
        )}

        {/* Submit button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="animate-spin">⏳</span> Loading...
            </span>
          ) : mode === 'login' ? (
            t('auth.loginButton')
          ) : (
            t('auth.signupButton')
          )}
        </button>

        {/* Toggle mode */}
        <div className="text-center pt-4 border-t">
          <p className="text-gray-600">
            {mode === 'login' ? t('auth.noAccount') : t('auth.hasAccount')}
          </p>
          <button
            type="button"
            onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
            className="text-indigo-600 hover:text-indigo-800 font-bold mt-1"
          >
            {mode === 'login' ? t('auth.signupButton') : t('auth.loginButton')}
          </button>
        </div>
      </form>
    </div>
  );
}

// Auth Modal Component
interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
  if (!isOpen) return null;

  const handleSuccess = () => {
    onSuccess?.();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="relative w-full max-w-md">
        <button
          onClick={onClose}
          className="absolute -top-2 -right-2 z-10 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
        <AuthForm onSuccess={handleSuccess} />
      </div>
    </div>
  );
}
