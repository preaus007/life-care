import { useState } from "react";
import { motion } from "framer-motion";
import InputField from "../components/InputField";
import PasswordStrengthMeter from "../components/PasswordStrengthMeter";

function SignUpPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const [passwordFocus, setPasswordFocus] = useState(false);
  const [errors, setErrors] = useState({});

  const validateSignUpForm = (formData) => {
    const errors = {};

    if (!formData.fullName.trim()) {
      errors.fullName = "Full name is required";
    } else if (formData.fullName.trim().length < 3) {
      errors.fullName = "Full name must be at least 3 characters";
    }

    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      errors.password = "Password is required";
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
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
    console.log("Form is valid:", formData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-5">
        <h1 className="text-2xl font-bold text-center mb-4">
          Create Account
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <InputField
            label="Full Name"
            id="fullName"
            value={formData.fullName}
            onChange={(e) =>
              setFormData({ ...formData, fullName: e.target.value })
            }
            error={errors.fullName}
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

          <PasswordStrengthMeter
            password={formData.password}
            visible={passwordFocus}
          />

          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-3 cursor-pointer bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-lg shadow-lg"
          >
            Sign Up
          </motion.button>
        </form>
      </div>
    </div>
  );
}

export default SignUpPage;
