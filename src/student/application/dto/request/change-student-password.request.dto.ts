import { ChangeStudentPasswordRequestDTO } from "./change-student-password.request.dto.type";


class ChangeStudentPasswordRequestDTOImpl implements
	ChangeStudentPasswordRequestDTO {
	authorizationToken: string;
	password: string;
	oldPassword: string;
}

export {
	ChangeStudentPasswordRequestDTOImpl
};