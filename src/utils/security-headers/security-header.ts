import { 
	NextFunction, 
	Request, 
	Response 
} from "express";



export const setSecurityHeaders = (
	request: Request,
	response: Response,
	next: NextFunction) => {

	response.setHeader("Content-Security-Policy", "default-src 'self';base-uri 'self';font-src 'self' https: data:;form-action 'self';frame-ancestors 'self';img-src 'self' data:;object-src 'none';script-src 'self';script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests");
	response.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
	response.setHeader("Cross-Origin-Opener-Policy", "same-origin");
	response.setHeader("Cross-Origin-Resource-Policy", "same-origin");
	response.setHeader("Origin-Agent-Cluster", "?1");
	response.setHeader("Referrer-Policy", "no-referrer");
	response.setHeader("Strict-Transport-Security", "max-age=15552000; includeSubDomains");
	response.setHeader("X-Content-Type-Options", "nosniff");
	response.setHeader("X-DNS-Prefetch-Control", "off");
	response.setHeader("X-Download-Options", "noopen");
	response.setHeader("X-Frame-Options", "SAMEORIGIN");
	response.setHeader("X-Permitted-Cross-Domain-Policies", "none");
	response.setHeader("X-XSS-Protection", "1; mode=block");

	next();
};