import rateLimit from "express-rate-limit";
import { RateLimiter } from "../types";

export class RateLimiterImpl implements RateLimiter {

	private _rateLimiterWindowMs: number | null = null;
	private _rateLimiterMaxRequests: number | null = null;


	set windowMs(rateLimiterWindowMs: number) {
		this._rateLimiterWindowMs = rateLimiterWindowMs;
	}

	set maxRequests(rateLimiterMaxRequests: number) {
		this._rateLimiterMaxRequests = rateLimiterMaxRequests;
	}

	limitRequests() {

		return rateLimit({
			windowMs: this._rateLimiterWindowMs ?? undefined,
			max: this._rateLimiterMaxRequests ?? undefined,
			standardHeaders: true,
			legacyHeaders: false,
			message: { errors: [{ message: "Too many requests, please try again later" }] },
			statusCode: 429
		});
	}
}