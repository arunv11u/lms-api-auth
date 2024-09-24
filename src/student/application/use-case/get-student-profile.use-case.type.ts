import { UseCase } from "../../../utils";
import { GetStudentProfileRequestDTO, GetStudentProfileResponseDTO } from "../dto";


export abstract class GetStudentProfileUseCase implements UseCase {
	abstract set getStudentProfileRequestDTO(
		getStudentProfileRequestDTO: GetStudentProfileRequestDTO
	);

	abstract execute(): Promise<GetStudentProfileResponseDTO>;
}