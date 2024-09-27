import { TokenRepository } from "../../../token";
import { UnitOfWork, UnitOfWorkImpl } from "../../../utils";
import { InstructorObject, InstructorRepository } from "../../domain";
import { ChangeInstructorPasswordRequestDTO } from "../dto";
import { ChangeInstructorPasswordUseCase } from "./change-instructor-password.use-case.type";



export class ChangeInstructorPasswordUseCaseImpl implements
	ChangeInstructorPasswordUseCase, InstructorObject {
	private _unitOfWork: UnitOfWork;
	private _changeInstructorPasswordRequestDTO:
		ChangeInstructorPasswordRequestDTO;

	constructor() {
		this._unitOfWork = new UnitOfWorkImpl();
	}

	set changeInstructorPasswordRequestDTO(
		changeInstructorPasswordRequestDTO: ChangeInstructorPasswordRequestDTO
	) {
		this._changeInstructorPasswordRequestDTO =
			changeInstructorPasswordRequestDTO;
	}

	async execute(): Promise<void> {
		const tokenRepository = this._unitOfWork.getRepository("TokenRepository") as TokenRepository;
		const instructorRepository = this._unitOfWork.getRepository("InstructorRepository") as InstructorRepository;


		const instructorEntity = await tokenRepository
			.validateInstructorAuthorizationToken(
				this._changeInstructorPasswordRequestDTO.authorizationToken
			);

		await instructorRepository.changeInstructorPassword(
			instructorEntity.id,
			this._changeInstructorPasswordRequestDTO.password
		);
	}
}