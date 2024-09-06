import {
	RateLimitRequestHandler
} from "express-rate-limit";


export abstract class RateLimiter {
	abstract set windowMs(rateLimiterWindowMs: number);
	abstract set maxRequests(rateLimiterMaxRequests: number);

	abstract limitRequests(): RateLimitRequestHandler;
}
