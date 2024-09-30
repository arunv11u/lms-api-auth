import { ChangeInstructorPasswordRequestDTO } from "./change-instructor-password.request.dto.type";


class ChangeInstructorPasswordRequestDTOImpl implements
	ChangeInstructorPasswordRequestDTO {
	authorizationToken: string;
	password: string;
}

export {
	ChangeInstructorPasswordRequestDTOImpl
};