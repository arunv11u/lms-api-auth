import { UseCase } from "../../../utils";
import { SignInInstructorWithGmailRequestDTO, SignInInstructorWithGmailResponseDTO } from "../dto";


export abstract class SignInInstructorWithGmailUseCase implements UseCase {
	abstract set signInInstructorWithGmailRequestDTO(
		signInInstructorWithGmailRequestDTO: SignInInstructorWithGmailRequestDTO
	);

	abstract execute(): Promise<SignInInstructorWithGmailResponseDTO>;
}