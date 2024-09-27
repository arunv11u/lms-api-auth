import { InstructorFactory } from "./instructor";
import { StudentFactory } from "./student";
import { TokenFactory } from "./token";

const defaultRoutePath = "/";
const authorizationTokenName = "authorization";

function getStudentFactory() {
	return new StudentFactory();
}

function getTokenFactory() {
	return new TokenFactory();
}

function getInstructorFactory() {
	return new InstructorFactory();
}

export {
	defaultRoutePath,
	authorizationTokenName,
	getStudentFactory,
	getTokenFactory,
	getInstructorFactory
};
