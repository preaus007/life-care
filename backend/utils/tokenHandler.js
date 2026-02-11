import jwt from "jsonwebtoken";
import "dotenv/config";

export const generateTokenAndSetCookie = (res, id) => {
	const token = jwt.sign({ _id: id }, process.env.JWT_SECRET, {
		expiresIn: "1d",
	});

	res.cookie("token", token, {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "strict",
		maxAge: 1 * 24 * 60 * 60 * 1000, // 1 day
	});

	return token;
};