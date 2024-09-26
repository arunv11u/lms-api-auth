

interface SignInStudentWithGmailResponseDTO {
	id: string;
	firstName: string;
	lastName: string;
	email: string;
	accessToken: string;
	refreshToken: string;
	profilePicture: string | null;
}

export {
	SignInStudentWithGmailResponseDTO
};