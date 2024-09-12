import { UserFactory } from "./users";

const defaultRoutePath = "/";

function getUserFactory() {
	return new UserFactory();
}

export {
	defaultRoutePath,
	getUserFactory
};
