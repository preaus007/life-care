import crypto from 'crypto';
import User from '../models/user.model.js';
import { comparePassword, hashPassword } from '../utils/passwordHandler.js';
import { generateTokenAndSetCookie } from '../utils/tokenHandler.js';
import { sendEmail } from '../utils/mailHandle.js';

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const isValidPassword = (password) =>
  typeof password === 'string' && password.length >= 6;

export const signup = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    if (!email || !password || !name) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid email address'
      });
    }

    if (!isValidPassword(password)) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters'
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists'
      });
    }

    const hashedPassword = await hashPassword(password);

    const verificationToken = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    const hashedVerificationToken = crypto
      .createHash('sha256')
      .update(verificationToken)
      .digest('hex');

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || 'Patient',
      verificationToken: hashedVerificationToken,
      verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000
    });

    try {
      await sendEmail(
        email,
        'Email Verification',
        `Your verification code is ${verificationToken}`,
        `<h1>Your verification code is ${verificationToken}</h1>`
      );
    } catch (emailError) {
      await User.findByIdAndDelete(user._id);

      return res.status(500).json({
        success: false,
        message: 'Failed to send verification email'
      });
    }

    res.status(201).json({
      success: true,
      message: 'User created. Verification email sent.',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Signup error:', error);

    res.status(500).json({
      success: false,
      message: 'Something went wrong'
    });
  }
};

export const verifyEmail = async (req, res) => {
  const { code } = req.body;
  try {
    if (!code || code.length !== 6) {
      return res.status(400).json({
        success: false,
        message: 'Verification code is required'
      });
    }

    const hashedCode = crypto.createHash('sha256').update(code).digest('hex');

    const user = await User.findOne({
      verificationToken: hashedCode,
      verificationTokenExpiresAt: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired verification code'
      });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiresAt = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Email verified successfully',
      user: {
        ...user._doc,
        password: undefined
      }
    });
  } catch (error) {
    console.log('error in verifyEmail ', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid email address'
      });
    }

    const user = await User.findOne({ email, isVerified: true });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    generateTokenAndSetCookie(res, user._id);

    user.lastLogin = new Date();
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Logged in successfully',
      user: {
        ...user._doc,
        password: undefined
      }
    });
  } catch (error) {
    console.log('Error in login ', error);
    res.status(400).json({ success: false, message: error.message });
  }
};

export const logout = async (req, res) => {
  res.clearCookie('token');
  res.status(200).json({ success: true, message: 'Logged out successfully' });
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: 'Email is required' });
    }

    if (!isValidEmail(email)) {
      return res
        .status(400)
        .json({
          success: false,
          message: 'Please enter a valid email address'
        });
    }

    const user = await User.findOne({ email, isVerified: true });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: 'User not found' });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000; // 1 hour

    const hashedResetToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    user.resetPasswordToken = hashedResetToken;
    user.resetPasswordTokenExpiresAt = resetTokenExpiresAt;

    await user.save();

    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    try {
      await sendEmail(
        email,
        'Password Reset',
        `Click the link to reset your password: ${resetUrl}`,
        `
		<div style="font-family: Arial, sans-serif; line-height: 1.6;">
			<h2>Password Reset Request</h2>
			<p>You requested to reset your password.</p>
			<p>Click the button below to reset your password:</p>

			<a href="${resetUrl}" 
			style="
				display: inline-block;
				padding: 12px 20px;
				background-color: #16a34a;
				color: #ffffff;
				text-decoration: none;
				border-radius: 6px;
				font-weight: bold;
			">
			Reset Password
			</a>

			<p style="margin-top: 20px;">
			If you did not request this, please ignore this email.
			</p>

			<p>This link will expire in 1 hour.</p>
		</div>
		`
      );
    } catch (emailError) {
      return res.status(500).json({
        success: false,
        message: 'Failed to send password reset email'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Password reset link sent to your email'
    });
  } catch (error) {
    console.log('Error in forgotPassword ', error);
    res.status(400).json({ success: false, message: error.message });
  }
};

export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;
  try {
    if (!password) {
      return res
        .status(400)
        .json({ success: false, message: 'Password is required' });
    }

    if (!isValidPassword(password)) {
      return res
        .status(400)
        .json({
          success: false,
          message: 'Password must be at least 6 characters'
        });
    }

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordTokenExpiresAt: { $gt: Date.now() },
      isVerified: true
    });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: 'Invalid or expired reset token' });
    }

    const hashedPassword = await hashPassword(password);

    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordTokenExpiresAt = undefined;
    await user.save();

    res
      .status(200)
      .json({ success: true, message: 'Password reset successful' });
  } catch (error) {
    console.log('Error in resetPassword ', error);
    res.status(400).json({ success: false, message: error.message });
  }
};

export const checkAuth = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: 'User not found' });
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    console.log('Error in checkAuth ', error);
    res.status(400).json({ success: false, message: error.message });
  }
};
