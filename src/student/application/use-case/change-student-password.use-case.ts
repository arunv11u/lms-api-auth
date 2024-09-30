import { TokenRepository } from "../../../token";
import { UnitOfWork, UnitOfWorkImpl } from "../../../utils";
import { StudentObject, StudentRepository } from "../../domain";
import { ChangeStudentPasswordRequestDTO } from "../dto";
import { ChangeStudentPasswordUseCase } from "./change-student-password.use-case.type";



export class ChangeStudentPasswordUseCaseImpl implements
	ChangeStudentPasswordUseCase, StudentObject {
	private _unitOfWork: UnitOfWork;
	private _changeStudentPasswordRequestDTO: ChangeStudentPasswordRequestDTO;

	constructor() {
		this._unitOfWork = new UnitOfWorkImpl();
	}

	set changeStudentPasswordRequestDTO(
		changeStudentPasswordRequestDTO: ChangeStudentPasswordRequestDTO
	) {
		this._changeStudentPasswordRequestDTO = changeStudentPasswordRequestDTO;
	}

	async execute(): Promise<void> {
		const tokenRepository = this._unitOfWork.getRepository("TokenRepository") as TokenRepository;
		const studentRepository = this._unitOfWork.getRepository("StudentRepository") as StudentRepository;


		const studentEntity = await tokenRepository
			.validateStudentAuthorizationToken(
				this._changeStudentPasswordRequestDTO.authorizationToken
			);

		await studentRepository.changeStudentPassword(
			studentEntity.id,
			this._changeStudentPasswordRequestDTO.password,
			this._changeStudentPasswordRequestDTO.oldPassword
		);
	}
}