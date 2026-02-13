import { motion } from 'framer-motion';

function InputField({
  label,
  id,
  type = 'text',
  value,
  onChange,
  error,
  placeholder,
  onFocus,
  icon: Icon,
  required
}) {
  return (
    <motion.div
      className="mb-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
        </label>
      )}

      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        )}
        <input
          type={type}
          id={id}
          value={value}
          onChange={onChange}
          onFocus={onFocus}
          placeholder={placeholder}
          required={required}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            Icon ? 'pl-10' : ''
          } ${error ? 'border-red-500' : 'border-gray-300'}`}
        />
      </div>

      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </motion.div>
  );
}

export default InputField;
