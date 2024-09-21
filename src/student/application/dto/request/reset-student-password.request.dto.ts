import { ResetStudentPasswordRequestDTO } from "./reset-student-password.request.dto.type";


class ResetStudentPasswordRequestDTOImpl implements
	ResetStudentPasswordRequestDTO {
	email: string;
	verificationCode: string;
	password: string;
}

export {
	ResetStudentPasswordRequestDTOImpl
};