

interface UpdateStudentProfileRequestDTO {
	authorizationToken: string;
	profilePicture: string | null;
	firstName: string | null;
	lastName: string | null;
}

export {
	UpdateStudentProfileRequestDTO
};