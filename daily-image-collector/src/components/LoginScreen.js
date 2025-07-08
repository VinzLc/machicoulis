// src/components/LoginScreen.js

import React, { useState } from 'react';
import { Gift, AlertCircle } from 'lucide-react';
import { signIn, signUp, confirmSignUp } from 'aws-amplify/auth';

const LoginScreen = ({ login }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [needsConfirmation, setNeedsConfirmation] = useState(false);
  const [confirmationCode, setConfirmationCode] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (isLogin) {
        // Check for admin credentials first
        if (username === 'admin' && password === 'admin') {
          console.log('Admin login successful');
          login('admin', 'admin@machicoulis.com');
          setIsLoading(false);
          return;
        }
        
        // Sign in existing user
        const { isSignedIn, nextStep } = await signIn({
          username,
          password
        });
        console.log('Sign in success:', isSignedIn);
        if (isSignedIn) {
          login(username, email);
        }
      } else {
        // Sign up new user
        if (password !== confirmPassword) {
          setError('Les mots de passe ne correspondent pas');
          setIsLoading(false);
          return;
        }
        
        const { isSignUpComplete, userId, nextStep } = await signUp({
          username,
          password,
          options: {
            userAttributes: {
              email: email,
            }
          }
        });
        
        console.log('Sign up success:', userId);
        setNeedsConfirmation(true);
        setError('');
      }
    } catch (error) {
      console.error('Auth error:', error);
      setError(getErrorMessage(error));
    }
    
    setIsLoading(false);
  };

  const handleConfirmSignUp = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const { isSignUpComplete, nextStep } = await confirmSignUp({
        username,
        confirmationCode
      });
      console.log('Confirmation success');
      
      // Auto sign in after confirmation
      const { isSignedIn } = await signIn({
        username,
        password
      });
      if (isSignedIn) {
        login(username, email);
      }
    } catch (error) {
      console.error('Confirmation error:', error);
      setError(getErrorMessage(error));
    }
    
    setIsLoading(false);
  };

  const getErrorMessage = (error) => {
    switch (error.name) {
      case 'UserNotFoundException':
        return 'Utilisateur non trouvé. Vérifiez votre nom d\'utilisateur.';
      case 'NotAuthorizedException':
        return 'Nom d\'utilisateur ou mot de passe incorrect.';
      case 'UserNotConfirmedException':
        return 'Compte non confirmé. Vérifiez votre email.';
      case 'UsernameExistsException':
        return 'Ce nom d\'utilisateur existe déjà.';
      case 'InvalidPasswordException':
        return 'Le mot de passe doit contenir au moins 8 caractères.';
      case 'CodeMismatchException':
        return 'Code de confirmation incorrect.';
      default:
        return error.message || 'Une erreur est survenue.';
    }
  };

  // Confirmation form
  if (needsConfirmation) {
    return (
      <div
        className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
        style={{
          backgroundImage: `url('https://machicoulis-20250704132620-hostingbucket-machicouli.s3.us-east-1.amazonaws.com/background.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div className="relative z-10 w-full max-w-md">
          <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border-4 border-yellow-400">
            <div className="text-center mb-8">
              <Gift className="mx-auto h-16 w-16 text-purple-600 mb-4 animate-pulse" />
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Confirmation requise</h2>
              <p className="text-gray-600">Vérifiez votre email et entrez le code de confirmation</p>
            </div>
            
            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-center">
                <AlertCircle className="h-5 w-5 mr-2" />
                {error}
              </div>
            )}
            
            <form onSubmit={handleConfirmSignUp} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Code de confirmation
                </label>
                <input
                  type="text"
                  value={confirmationCode}
                  onChange={(e) => setConfirmationCode(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  placeholder="123456"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-purple-400 disabled:to-pink-400 text-white font-bold py-4 px-4 rounded-lg transition-all transform hover:scale-105 shadow-lg"
              >
                {isLoading ? 'Confirmation...' : '✅ Confirmer mon compte'}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // Main login/signup form
  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{
        backgroundImage: `url('https://machicoulis-20250704132620-hostingbucket-machicouli.s3.us-east-1.amazonaws.com/background.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-40"></div>
      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-12">
          <h1
            className="text-6xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 mb-4 transform -rotate-2 hover:rotate-0 transition-transform duration-500"
            style={{
              fontFamily: 'Comic Sans MS, cursive, sans-serif',
              textShadow: '4px 4px 0px rgba(0,0,0,0.3), 8px 8px 0px rgba(255,255,255,0.1)',
              filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.5))'
            }}
          >
            POCKET
          </h1>
          <h1
            className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-green-500 mb-2 transform rotate-1 hover:-rotate-1 transition-transform duration-500"
            style={{
              fontFamily: 'Comic Sans MS, cursive, sans-serif',
              textShadow: '4px 4px 0px rgba(0,0,0,0.3), 8px 8px 0px rgba(255,255,255,0.1)',
              filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.5))'
            }}
          >
            MACHICOULIS
          </h1>
          <div className="flex justify-center items-center space-x-2 mb-6">
            <div className="text-3xl animate-bounce">🏰</div>
            <p className="text-white text-lg font-bold bg-black bg-opacity-50 px-3 py-1 rounded-full">
              Collectionne tes personnages préférés !
            </p>
            <div className="text-3xl animate-bounce delay-300">⚔️</div>
          </div>
        </div>
        <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border-4 border-yellow-400 transform hover:scale-105 transition-transform duration-300">
          <div className="text-center mb-8">
            <Gift className="mx-auto h-16 w-16 text-purple-600 mb-4 animate-pulse" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              {isLogin ? 'Connexion' : 'Créer un compte'}
            </h2>
            <p className="text-gray-600">
              {isLogin ? 'Bon retour, aventurier !' : 'Une nouvelle image t\'attend chaque jour!'}
            </p>
          </div>
          
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-center">
              <AlertCircle className="h-5 w-5 mr-2" />
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nom d'utilisateur
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 border-2 border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                placeholder="Entre ton nom d'aventurier"
                required
              />
            </div>
            
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  placeholder="ton.email@exemple.com"
                  required
                />
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mot de passe
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border-2 border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                placeholder="••••••••"
                required
              />
            </div>
            
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirmer le mot de passe
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  placeholder="••••••••"
                  required
                />
              </div>
            )}
            
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-purple-400 disabled:to-pink-400 text-white font-bold py-4 px-4 rounded-lg transition-all transform hover:scale-105 shadow-lg"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2 inline-block"></div>
                  {isLogin ? 'Connexion...' : 'Création...'}
                </>
              ) : (
                <>🚀 {isLogin ? 'Se connecter' : 'Créer mon compte'}</>
              )}
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
              }}
              className="text-purple-600 hover:text-purple-700 text-sm font-medium underline"
            >
              {isLogin ? "Pas encore de compte ? Créer un compte" : "Déjà un compte ? Se connecter"}
            </button>
          </div>
        </div>
        <div className="absolute -top-10 -left-10 text-4xl animate-bounce opacity-80">🛡️</div>
        <div className="absolute -top-5 -right-5 text-3xl animate-ping opacity-80">✨</div>
        <div className="absolute -bottom-5 -left-5 text-3xl animate-pulse opacity-80">🗡️</div>
        <div className="absolute -bottom-10 -right-10 text-4xl animate-bounce delay-500 opacity-80">🏹</div>
      </div>
    </div>
  );
};

export default LoginScreen;