import { 
	initializeInstructorModel, 
	setupInstructorAssociations 
} from "./instructor";
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
	initializeInstructorModel();

	setupStudentAssociations();
	setupUserAssociations();
	setupTokenAssociations();
	setupStudentForgotPasswordAssociations();
	setupInstructorAssociations();
}

export {
	loadDBModels
};