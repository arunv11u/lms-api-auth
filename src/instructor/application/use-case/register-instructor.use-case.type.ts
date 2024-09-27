import { UseCase } from "../../../utils";
import { RegisterInstructorRequestDTO, RegisterInstructorResponseDTO } from "../dto";


export abstract class RegisterInstructorUseCase implements UseCase {
	abstract set registerInstructorRequestDTO(
		registerInstructorRequestDTO: RegisterInstructorRequestDTO
	);

	abstract execute(): Promise<RegisterInstructorResponseDTO>;
}