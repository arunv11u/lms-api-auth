import { DataTypes, Model, Optional } from "sequelize";
import { postgresqlConnect } from "../../../utils";

enum TokenTypes {
	refresh = "REFRESH_TOKEN",
}

enum UserTypes {
	student = "STUDENT",
	instructor = "INSTRUCTOR"
}

class TokenORMEntity {
	id: string;
	user_id: string;
	user_type: UserTypes;
	session_id: string;
	type: TokenTypes;
	token_expire_on: Date;
	created_by: string;
	last_modified_by: string;
	created_at?: Date;
	last_modified_at?: Date;
	is_deleted: boolean;
	version: number;
}

interface TokenCreationAttributes extends Optional<TokenORMEntity, "id" | "created_at" | "last_modified_at"> { }

type Token = Model<TokenORMEntity, TokenCreationAttributes>;

function initializeTokenModel() {
	const sequelize = postgresqlConnect.postgresClient;

	sequelize.define<Token>("Token", {
		id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true
		},
		user_id: {
			type: DataTypes.UUID,
			allowNull: false
		},
		user_type: {
			type: DataTypes.ENUM,
			values: [
				UserTypes.student,
				UserTypes.instructor
			]
		},
		session_id: {
			type: DataTypes.UUIDV4,
			allowNull: false
		},
		type: {
			type: DataTypes.STRING,
			values: [
				TokenTypes.refresh
			]
		},
		token_expire_on: {
			type: DataTypes.DATE,
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
		is_deleted: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: false
		},
		version: {
			type: DataTypes.INTEGER,
			allowNull: false
		}
	}, {
		tableName: "tokens",
		timestamps: true,
		createdAt: "created_at",
		updatedAt: "last_modified_at"
	});
}

function setupTokenAssociations() { 
	const sequelize = postgresqlConnect.postgresClient;
	const Token = sequelize.models["Token"];
	const User = sequelize.models["User"];

	Token.belongsTo(User, {
		foreignKey: "user_id",
		as: "user"
	});

	Token.belongsTo(User, {
		foreignKey: "created_by",
		as: "creator"
	});

	Token.belongsTo(User, {
		foreignKey: "last_modified_by",
		as: "modifier"
	});
}


export {
	TokenTypes,
	UserTypes,
	TokenORMEntity,
	TokenCreationAttributes,
	initializeTokenModel,
	setupTokenAssociations
};