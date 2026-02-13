import { useState } from 'react';
import { motion } from 'framer-motion';
import InputField from '../components/InputField';
import PasswordStrengthMeter from '../components/PasswordStrengthMeter';
import { useAuthStore } from '../store/authStore';
import { Link, useNavigate } from 'react-router-dom';
import { Loader } from 'lucide-react';

function SignUpPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const [passwordFocus, setPasswordFocus] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { signup, error, isLoading } = useAuthStore();

  const validateSignUpForm = (formData) => {
    const errors = {};

    if (!formData.name.trim()) {
      errors.name = 'Full name is required';
    } else if (formData.name.trim().length < 3) {
      errors.name = 'Full name must be at least 3 characters';
    }

    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      errors.password = 'Password is required';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validation = validateSignUpForm(formData);

    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setErrors({});
    // console.log("Form is valid:", formData);
    handleSignUp(e);
  };

  const handleSignUp = async (e) => {
    e.preventDefault();

    try {
      await signup(formData.name, formData.email, formData.password);
      navigate('/verify-email');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden"
      >
        <div className="w-full max-w-md bg-white shadow-lg p-5">
          <h1 className="text-2xl font-bold text-center mb-4">
            Create Account
          </h1>

          <form onSubmit={handleSubmit} className="space-y-5">
            <InputField
              label="Full Name"
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              error={errors.name}
              placeholder="John Doe"
            />

            <InputField
              label="Email Address"
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              error={errors.email}
              placeholder="john@example.com"
            />

            <InputField
              label="Password"
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              onFocus={() => setPasswordFocus(true)}
              error={errors.password}
              placeholder="Enter your password"
            />

            {error && (
              <p className="mt-1 text-sm text-red-600 text-center">{error}</p>
            )}

            <PasswordStrengthMeter
              password={formData.password}
              visible={passwordFocus}
            />

            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3 cursor-pointer bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-lg shadow-lg"
            >
              {isLoading ? (
                <Loader className=" animate-spin mx-auto" size={24} />
              ) : (
                'Sign Up'
              )}
            </motion.button>
          </form>
        </div>

        <div className="px-8 py-4 bg-gray-900 bg-opacity-50 flex justify-center">
          Already have an account?
          <Link
            to={'/login'}
            className="text-sm text-green-400 hover:underline flex items-center"
          >
            Login
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

export default SignUpPage;
