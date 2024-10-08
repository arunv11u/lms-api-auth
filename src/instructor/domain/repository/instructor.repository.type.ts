import { Repository, UploadPreSignedURLResponse } from "../../../utils";
import { InstructorEntity } from "../entity";


export abstract class InstructorRepository extends Repository {
	abstract getId(): string;
	abstract getUserIdWithInstructorId(id: string): Promise<string>;
	abstract register(instructor: InstructorEntity): Promise<InstructorEntity>;
	abstract signInWithEmail(
		email: string,
		password: string
	): Promise<{ isValidCredentials: boolean }>;
	abstract getUserWithEmail(email: string): Promise<InstructorEntity>;
	abstract registerInstructorWithGoogleOAuth(
		authCode: string,
		redirectUri: string
	): Promise<InstructorEntity>;
	abstract forgotInstructorPassword(
		email: string
	): Promise<void>;
	abstract resetInstructorPassword(
		email: string,
		verificationCode: string,
		password: string
	): Promise<void>;
	abstract getInstructorProfileById(
		id: string
	): Promise<InstructorEntity>;
	abstract getInstructorProfileByUserId(
		userId: string
	): Promise<InstructorEntity>;
	abstract changeInstructorPassword(
		id: string,
		password: string
	): Promise<void>;
	abstract uploadInstructorProfilePicture(
		id: string,
		mimeType: string
	): Promise<UploadPreSignedURLResponse>;
	abstract updateInstructorProfile(
		instructor: InstructorEntity
	): Promise<InstructorEntity>;
}