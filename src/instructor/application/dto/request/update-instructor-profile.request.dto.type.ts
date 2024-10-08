

interface UpdateInstructorProfileRequestDTO {
	authorizationToken: string;
	profilePicture: string | null;
	firstName: string | null;
	lastName: string | null;
	designation: string | null;
}

export {
	UpdateInstructorProfileRequestDTO
};