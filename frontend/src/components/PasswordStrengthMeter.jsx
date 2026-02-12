import { Check, X } from "lucide-react";

function PasswordCriteria({ password }) {

    const criteria = [
        { label: "At least 6 characters", valid: password.length >= 6 },
        { label: "Contains uppercase letter", valid: /[A-Z]/.test(password) },
        { label: "Contains lowercase letter", valid: /[a-z]/.test(password) },
        { label: "Contains a number", valid: /[0-9]/.test(password) },
        { label: "Contains special character", valid: /[!@#$%^&*(),.?":{}|<>]/.test(password) },
    ];

    return (
		<div className='mt-2 space-y-1'>
			{criteria.map((item) => (
				<div key={item.label} className='flex items-center text-xs'>
					{item.valid ? (
						<Check className='size-4 text-green-500 mr-2' />
					) : (
						<X className='size-4 text-gray-500 mr-2' />
					)}
					<span className={item.valid ? "text-green-500" : "text-gray-400"}>{item.label}</span>
				</div>
			))}
		</div>
	);

}

function PasswordStrengthMeter({ password, visible }) {
  if (!visible && !password) return null;

  const getStrength = (pass) => {
    let strength = 0;
    if (pass.length >= 6) strength++;
    if (pass.match(/[a-z]/)) strength++;
    if (pass.match(/[A-Z]/)) strength++;
    if (pass.match(/[0-9]/)) strength++;
    if (pass.match(/[!@#$%^&*(),.?":{}|<>]/)) strength++;
    return strength;
  };
  
  const strength = getStrength(password);

  const getStrengthTestAndColor = (strength) => {
    if (!password) return { label: "", width: "0%", color: "" };
    if (strength <= 2) return { label: "Very Weak", width: "20%", color: "bg-red-500" };
    if (strength === 3) return { label: "Weak", width: "40%", color: "bg-orange-500" };
    if (strength === 4) return { label: "Medium", width: "60%", color: "bg-yellow-500" };
    return { label: "Strong", width: "100%", color: "bg-green-500" };
  };

  return (
    <div className="space-y-3">
      {/* Strength Bar */}
      <div>
        <div className="flex justify-between mb-1">
          <span className="text-sm font-medium text-gray-700">
            Password strength
          </span>
          <span className="text-sm font-medium">
            {getStrengthTestAndColor(strength).label}
          </span>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${getStrengthTestAndColor(strength).color}`}
            style={{ width: getStrengthTestAndColor(strength).width }}
          />
        </div>
      </div>

      {/* Requirements */}
      <div className="space-y-2">
        <PasswordCriteria password={password} />
      </div>
    </div>
  );
}

export default PasswordStrengthMeter;
