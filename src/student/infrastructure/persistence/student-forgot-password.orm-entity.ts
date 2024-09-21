import { DataTypes, Model, Optional } from "sequelize";
import { postgresqlConnect } from "../../../utils";


class StudentForgotPasswordORMEntity {
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

interface StudentForgotPasswordCreationAttributes extends Optional<StudentForgotPasswordORMEntity, "id" | "created_at" | "last_modified_at"> { }

type StudentForgotPassword = Model<
	StudentForgotPasswordORMEntity,
	StudentForgotPasswordCreationAttributes
>;

function initializeStudentForgotPasswordModel() {
	const sequelize = postgresqlConnect.postgresClient;

	sequelize.define<StudentForgotPassword>("StudentForgotPassword", {
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
		tableName: "student_forgot_passwords",
		timestamps: true,
		createdAt: "created_at",
		updatedAt: "last_modified_at"
	});
}

function setupStudentForgotPasswordAssociations() {
	const sequelize = postgresqlConnect.postgresClient;
	const StudentForgotPassword = sequelize.models["StudentForgotPassword"];
	const User = sequelize.models["User"];

	StudentForgotPassword.belongsTo(User, {
		foreignKey: "user_id",
		as: "user"
	});

	StudentForgotPassword.belongsTo(User, {
		foreignKey: "created_by",
		as: "creator"
	});

	StudentForgotPassword.belongsTo(User, {
		foreignKey: "last_modified_by",
		as: "modifier"
	});
}


export {
	StudentForgotPasswordORMEntity,
	StudentForgotPasswordCreationAttributes,
	initializeStudentForgotPasswordModel,
	setupStudentForgotPasswordAssociations
};