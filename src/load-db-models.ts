import { initializeStudentModel, setupStudentAssociations } from "./student";
import { initializeTokenModel, setupTokenAssociations } from "./token";
import { initializeUserModel, setupUserAssociations } from "./user";


function loadDBModels() {
	initializeUserModel();
	initializeStudentModel();
	initializeTokenModel();

	setupStudentAssociations();
	setupUserAssociations();
	setupTokenAssociations();
}

export {
	loadDBModels
};