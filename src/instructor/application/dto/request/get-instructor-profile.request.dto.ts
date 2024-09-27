import { GetInstructorProfileRequestDTO } from "./get-instructor-profile.request.dto.type";


class GetInstructorProfileRequestDTOImpl implements
	GetInstructorProfileRequestDTO {
	authorizationToken: string;
}

export {
	GetInstructorProfileRequestDTOImpl
};