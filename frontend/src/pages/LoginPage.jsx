import { useState } from "react";
import { motion } from "framer-motion";
import InputField from "../components/InputField";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { login, error, isLoading } = useAuthStore();

  const validateLoginForm = (formData) => {
    const errors = {};

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
    const validation = validateLoginForm(formData);

    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setErrors({});
    handleLogin(e);
  };

  const handleLogin = async (e) => {
		e.preventDefault();
		try {
            const result = await login(formData.email, formData.password);
            if( result.success ){
                navigate("/home");
            } else {
                setErrors({ form: result.error || "Login failed" });
            }
		} catch (error) {
			console.log(error);
		}
	};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-5">
        <h1 className="text-2xl font-bold text-center mb-4">
          Login to continue
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">

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
            error={errors.password}
            placeholder="Enter your password"
          />

          <motion.button
            type="submit"
            disabled={isLoading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-3 cursor-pointer bg-linear-to-r from-green-500 to-emerald-600 text-white font-bold rounded-lg shadow-lg"
          >
            Log In
          </motion.button>
          {error && (<p className="mt-1 text-sm text-red-600 text-center">{error}</p>)}  
        </form>
      </div>
    </div>
  );
}

export default LoginPage;