import { ResetInstructorPasswordRequestDTO } from "./reset-instructor-password.request.dto.type";


class ResetInstructorPasswordRequestDTOImpl implements
	ResetInstructorPasswordRequestDTO {
	email: string;
	verificationCode: string;
	password: string;
}

export {
	ResetInstructorPasswordRequestDTOImpl
};