import { DataTypes, Model, Optional } from "sequelize";
import { postgresqlConnect } from "../../../utils";


class InstructorForgotPasswordORMEntity {
	id: string;
	user_id: string;
	verification_code: string;
	is_valid: boolean;
	created_by: string;
	last_modified_by: string;
	created_at?: Date;
	last_modified_at?: Date;
	version: number;
}

interface InstructorForgotPasswordCreationAttributes extends
	Optional<InstructorForgotPasswordORMEntity, "id" | "created_at" | "last_modified_at"> { }

type InstructorForgotPassword = Model<
	InstructorForgotPasswordORMEntity,
	InstructorForgotPasswordCreationAttributes
>;

function initializeInstructorForgotPasswordModel() {
	const sequelize = postgresqlConnect.postgresClient;

	sequelize.define<InstructorForgotPassword>("InstructorForgotPassword", {
		id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true
		},
		user_id: {
			type: DataTypes.UUID,
			allowNull: false,
			references: {
				model: "users",
				key: "id"
			}
		},
		verification_code: {
			type: DataTypes.STRING,
			allowNull: false
		},
		is_valid: {
			type: DataTypes.BOOLEAN,
			allowNull: false
		},
		created_by: {
			type: DataTypes.UUID,
			allowNull: false,
			references: {
				model: "users",
				key: "id"
			}
		},
		last_modified_by: {
			type: DataTypes.UUID,
			allowNull: false,
			references: {
				model: "users",
				key: "id"
			}
		},
		version: {
			type: DataTypes.INTEGER,
			allowNull: false
		}
	}, {
		tableName: "instructor_forgot_passwords",
		timestamps: true,
		createdAt: "created_at",
		updatedAt: "last_modified_at"
	});
}

function setupInstructorForgotPasswordAssociations() {
	const sequelize = postgresqlConnect.postgresClient;
	const InstructorForgotPassword = sequelize.models["InstructorForgotPassword"];
	const User = sequelize.models["User"];

	InstructorForgotPassword.belongsTo(User, {
		foreignKey: "user_id",
		as: "user"
	});

	InstructorForgotPassword.belongsTo(User, {
		foreignKey: "created_by",
		as: "creator"
	});

	InstructorForgotPassword.belongsTo(User, {
		foreignKey: "last_modified_by",
		as: "modifier"
	});
}


export {
	InstructorForgotPasswordORMEntity,
	InstructorForgotPasswordCreationAttributes,
	initializeInstructorForgotPasswordModel,
	setupInstructorForgotPasswordAssociations
};