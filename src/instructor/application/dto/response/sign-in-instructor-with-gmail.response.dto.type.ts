

interface SignInInstructorWithGmailResponseDTO {
	id: string;
	firstName: string;
	lastName: string;
	email: string;
	designation: string | null;
	accessToken: string;
	refreshToken: string;
	profilePicture: string | null;
}

export {
	SignInInstructorWithGmailResponseDTO
};