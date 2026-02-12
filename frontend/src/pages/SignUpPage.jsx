import { useState } from 'react';

function SignUpPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: ''
  });

  const [passwordFocus, setPasswordFocus] = useState(false);

  const [errors, setErrors] = useState({});

  // Password validation checks
  const hasMinLength = formData.password.length >= 6;
  const hasUppercase = /[A-Z]/.test(formData.password);
  const hasLowercase = /[a-z]/.test(formData.password);
  const hasNumber = /[0-9]/.test(formData.password);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(formData.password);

  // Calculate password strength
  const validChecks = [hasMinLength, hasUppercase, hasLowercase, hasNumber, hasSpecial].filter(Boolean).length;
  
  const getStrength = () => {
    if (formData.password.length === 0) return { label: '', width: '0%', color: '' };
    if (validChecks <= 2) return { label: 'Very Weak', width: '20%', color: 'bg-red-500' };
    if (validChecks === 3) return { label: 'Weak', width: '40%', color: 'bg-orange-500' };
    if (validChecks === 4) return { label: 'Medium', width: '60%', color: 'bg-yellow-500' };
    return { label: 'Strong', width: '100%', color: 'bg-green-500' };
  };

  const strength = getStrength();

  const validateSignUpForm = (formData) => {
    const errors = {};

    if( !formData.fullName.trim() ) {
        errors.fullName = 'Full name is required';
    } else if ( formData.fullName.trim().length < 3 ) {
        errors.fullName = 'Full name must be at least 3 characters';
    }

    if( !formData.email.trim() ) {
        errors.email = 'Email is required';
    } else if( !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) ) {
        errors.email = 'Please enter a valid email address';
    }

    if( !formData.password ) {
        errors.password = 'Password is required';
    } else {
        // Check password requirements
        const hasMinLength = formData.password.length >= 6;
        const hasUppercase = /[A-Z]/.test(formData.password);
        const hasLowercase = /[a-z]/.test(formData.password);
        const hasNumber = /[0-9]/.test(formData.password);
        const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(formData.password);

        // Count valid checks
        const validChecks = [hasMinLength, hasUppercase, hasLowercase, hasNumber, hasSpecial].filter(Boolean).length;
        const strengthPercentage = (validChecks / 5) * 100;

        // Check if password strength is more than 50%
        if( strengthPercentage <= 50 ) {
            errors.password = 'Password strength must be above 50%. Please meet at least 3 requirements.';
        }
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validation = validateSignUpForm(formData);
    
    if( !validation.isValid ) {
        setErrors(validation.errors);
        return;
    }
    
    setErrors({});
    console.log('Form is valid, sending to database:', formData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-lg p-5">
          <h1 className="text-2xl font-bold text-gray-900 mb-4 text-center">
            Create Account
          </h1>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name */}
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                id="fullName"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.fullName ? 'border-red-500' : ''}`}
                placeholder="John Doe"
              />
              {errors.fullName && (
                <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>
              )}
            </div>

            {/* Email Address */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.email ? 'border-red-500' : ''}`}
                placeholder="john@example.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                onFocus={() => setPasswordFocus(true)}
                className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.password ? 'border-red-500' : ''}`}
                placeholder="Enter your password"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            {/* Password Strength Indicator */}
            {(passwordFocus || formData.password) && (
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-gray-700">Password strength</span>
                    <span className={`text-sm font-medium ${
                      strength.color === 'bg-red-500' ? 'text-red-500' :
                      strength.color === 'bg-orange-500' ? 'text-orange-500' :
                      strength.color === 'bg-yellow-500' ? 'text-yellow-500' :
                      'text-green-500'
                    }`}>
                      {strength.label}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${strength.color}`}
                      style={{ width: strength.width }}
                    ></div>
                  </div>
                </div>

                {/* Password Requirements */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <div className={`w-4 h-4 flex items-center justify-center ${hasMinLength ? 'text-green-500' : 'text-gray-400'}`}>
                      {hasMinLength ? '✓' : '○'}
                    </div>
                    <span className={`text-sm ${hasMinLength ? 'text-green-700' : 'text-gray-600'}`}>
                      At least 6 characters
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <div className={`w-4 h-4 flex items-center justify-center ${hasUppercase ? 'text-green-500' : 'text-gray-400'}`}>
                      {hasUppercase ? '✓' : '○'}
                    </div>
                    <span className={`text-sm ${hasUppercase ? 'text-green-700' : 'text-gray-600'}`}>
                      Contains uppercase letter
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <div className={`w-4 h-4 flex items-center justify-center ${hasLowercase ? 'text-green-500' : 'text-gray-400'}`}>
                      {hasLowercase ? '✓' : '○'}
                    </div>
                    <span className={`text-sm ${hasLowercase ? 'text-green-700' : 'text-gray-600'}`}>
                      Contains lowercase letter
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <div className={`w-4 h-4 flex items-center justify-center ${hasNumber ? 'text-green-500' : 'text-gray-400'}`}>
                      {hasNumber ? '✓' : '○'}
                    </div>
                    <span className={`text-sm ${hasNumber ? 'text-green-700' : 'text-gray-600'}`}>
                      Contains a number
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <div className={`w-4 h-4 flex items-center justify-center ${hasSpecial ? 'text-green-500' : 'text-gray-400'}`}>
                      {hasSpecial ? '✓' : '○'}
                    </div>
                    <span className={`text-sm ${hasSpecial ? 'text-green-700' : 'text-gray-600'}`}>
                      Contains special character
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium mt-6"
            >
              Sign Up
            </button>
          </form>

          {/* Login Link */}
          <p className="text-center text-sm text-gray-600 mt-6">
            Already have an account?{' '}
            <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">
              Log in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignUpPage;