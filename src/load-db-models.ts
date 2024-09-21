import { 
	initializeStudentForgotPasswordModel, 
	initializeStudentModel, 
	setupStudentAssociations, 
	setupStudentForgotPasswordAssociations 
} from "./student";
import { 
	initializeTokenModel, 
	setupTokenAssociations 
} from "./token";
import { 
	initializeUserModel, 
	setupUserAssociations 
} from "./user";


function loadDBModels() {
	initializeUserModel();
	initializeStudentModel();
	initializeTokenModel();
	initializeStudentForgotPasswordModel();

	setupStudentAssociations();
	setupUserAssociations();
	setupTokenAssociations();
	setupStudentForgotPasswordAssociations();
}

export {
	loadDBModels
};