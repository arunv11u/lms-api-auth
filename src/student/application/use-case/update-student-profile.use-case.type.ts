import { UseCase } from "../../../utils";
import { UpdateStudentProfileRequestDTO, UpdateStudentProfileResponseDTO } from "../dto";


export abstract class UpdateStudentProfileUseCase implements UseCase {
	abstract set updateStudentProfileRequestDTO(
		updateStudentProfileRequestDTO:
			UpdateStudentProfileRequestDTO
	);

	abstract execute(): Promise<UpdateStudentProfileResponseDTO>;
}