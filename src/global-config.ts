import { StudentFactory } from "./student";
import { TokenFactory } from "./token";

const defaultRoutePath = "/";

function getStudentFactory() {
	return new StudentFactory();
}

function getTokenFactory() {
	return new TokenFactory();
}

export {
	defaultRoutePath,
	getStudentFactory,
	getTokenFactory
};
