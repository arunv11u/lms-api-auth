import { UseCase } from "../../../utils";
import { SignInInstructorRequestDTO, SignInInstructorResponseDTO } from "../dto";


export abstract class SignInInstructorUseCase implements UseCase {
	abstract set signInInstructorRequestDTO(
		signInInstructorRequestDTO: SignInInstructorRequestDTO
	);

	abstract execute(): Promise<SignInInstructorResponseDTO>;
}