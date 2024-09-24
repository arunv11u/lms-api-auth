import nconf from "nconf";
import {
	Authorization,
	AuthorizationImpl
} from "@arunvaradharajalu/common.learning-management-system-api.authorization";

function getAuthorization(): Authorization {
	const authroization = new AuthorizationImpl(nconf.get("JWT_PRIVATE_KEY"));

	return authroization;
}

export {
	getAuthorization
};