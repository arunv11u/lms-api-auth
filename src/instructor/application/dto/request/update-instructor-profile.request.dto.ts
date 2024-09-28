import { UpdateInstructorProfileRequestDTO } from "./update-instructor-profile.request.dto.type";


class UpdateInstructorProfileRequestDTOImpl implements
	UpdateInstructorProfileRequestDTO {
	authorizationToken: string;
	firstName: string | null = null;
	lastName: string | null = null;
	profilePicture: string | null = null;
}

export {
	UpdateInstructorProfileRequestDTOImpl
};