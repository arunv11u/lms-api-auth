import { UseCase } from "../../../utils";
import { UpdateInstructorProfileRequestDTO, UpdateInstructorProfileResponseDTO } from "../dto";


export abstract class UpdateInstructorProfileUseCase implements UseCase {
	abstract set updateInstructorProfileRequestDTO(
		updateInstructorProfileRequestDTO:
			UpdateInstructorProfileRequestDTO
	);

	abstract execute(): Promise<UpdateInstructorProfileResponseDTO>;
}