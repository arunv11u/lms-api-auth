import { UseCase } from "../../../utils";
import { RegisterStudentRequestDTO, RegisterStudentResponseDTO } from "../dto";


export abstract class RegisterStudentUseCase implements UseCase {
	abstract set registerStudentRequestDTO(
		registerStudentRequestDTO: RegisterStudentRequestDTO
	);
	
	abstract execute(): Promise<RegisterStudentResponseDTO>;
}