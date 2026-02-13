import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthStore } from '../store/authStore';

export default function VerificationPage() {
  const navigate = useNavigate();
  const { verifyEmail } = useAuthStore();
  
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    // Auto-focus input on mount
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    // Auto-verify when 6 digits are entered
    if (code.length === 6 && !isVerifying) {
      // eslint-disable-next-line react-hooks/immutability
      handleVerify();
    }
  }, [code]);

  const handleVerify = async () => {
    setIsVerifying(true);
    setError('');

    try {
      const result = await verifyEmail(code);
      
      if (result.success) {
        // Navigate to home page on success
        navigate('/home');
      } else {
        setError(result.error || 'Invalid verification code');
        setCode('');
        setIsVerifying(false);
      }
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      setError('Verification failed. Please try again.');
      setCode('');
      setIsVerifying(false);
    }
  };

  const handleChange = (e) => {
    const value = e.target.value;
    
    // Only allow numbers and max 6 digits
    if (/^\d*$/.test(value) && value.length <= 6) {
      setCode(value);
      setError(''); 
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text');
    const numbers = pastedData.replace(/\D/g, '').slice(0, 6);
    setCode(numbers);
  };

  const handleResend = async () => {
    setError('');
    // TODO: Implement resend logic
    console.log('Resending verification code...');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <svg
                className="w-8 h-8 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Verify Your Email
            </h1>
            <p className="text-gray-600 text-sm">
              We've sent a 6-digit verification code to
            </p>
            <p className="text-gray-900 font-medium text-sm mt-1">
              your@email.com
            </p>
          </div>

          {/* Verification Code Input */}
          <motion.div 
            className="mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-2 text-center">
              Enter verification code
            </label>
            <input
              ref={inputRef}
              type="text"
              id="code"
              value={code}
              onChange={handleChange}
              onPaste={handlePaste}
              disabled={isVerifying}
              className={`w-full px-4 py-3 text-center text-2xl font-semibold tracking-widest border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed transition-all ${
                error ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="000000"
              maxLength={6}
              inputMode="numeric"
              pattern="\d*"
              autoComplete="one-time-code"
            />
            
            {/* Progress Indicator */}
            <div className="flex justify-center gap-1 mt-3">
              {[...Array(6)].map((_, index) => (
                <div
                  key={index}
                  className={`h-1.5 w-8 rounded-full transition-all duration-200 ${
                    index < code.length
                      ? 'bg-blue-600'
                      : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>

            {/* Error Message */}
            {error && (
              <div className="mt-3 flex items-center justify-center gap-2 text-red-600">
                <p className="text-sm">{error}</p>
              </div>
            )}

            {/* Verifying State */}
            {isVerifying && (
              <div className="mt-3 flex items-center justify-center gap-2 text-blue-600">
                <p className="text-sm">Verifying...</p>
              </div>
            )}
          </motion.div>

          {/* Resend Code */}
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">
              Didn't receive the code?
            </p>
            <button
              onClick={handleResend}
              disabled={isVerifying}
              className="text-blue-600 cursor-pointer hover:text-blue-700 font-medium text-sm disabled:text-gray-400 disabled:cursor-not-allowed"
            >
              Resend Code
            </button>
          </div>

          {/* Back Link */}
          <div className="mt-6 text-center">
            <button
              onClick={() => navigate('/signup')}
              disabled={isVerifying}
              className="text-gray-600 cursor-pointer hover:text-gray-900 text-sm disabled:text-gray-400 disabled:cursor-not-allowed"
            >
              ← Back to Sign Up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}