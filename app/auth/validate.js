import jwt from 'jsonwebtoken'

const JWT_SECRET = 'put-your-JWT-secret-here'; // you can set this w/ an environment variable

export const authValidate = function(req) {
	try {
		return jwt.verify(req.cookies.ds, JWT_SECRET)
	} catch (error) {
		return {
			unauthorized: true,
			message: 'Unauthorized',
		}
	}
}
