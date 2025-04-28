import { DataTypes } from "sequelize";
import { sequelize } from "../config/postgres.js";
import Cargo from "./CargoModel.js";

const Usuario = sequelize.define(
    'usuarios',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        nome: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },

        email: {
            type: DataTypes.STRING(100),
            allowNull: false,
            unique: true,
        },

        passwordHash: {
            type: DataTypes.TEXT,
            allowNull: false,
        },

        cpf: {
            type: DataTypes.STRING(14),
            allowNull: false,
            unique: true,
        },
        
        estudante: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        codigoSenha: {
            field: 'codigo_senha',
            type: DataTypes.STRING(255),
        },
        codigoSenhaExpiracao: {
            field: 'codigo_senha_expiracao',
            type: DataTypes.DATE,
        }
        
    },
    {
        freezeTableName: true,
        timestamps: true,
        createdAt: 'create_at',
        updatedAt: 'updated_at',
    }
);

Usuario.belongsTo(Cargo, {
    as: 'cargo',
    onUpdate: 'NO ACTION',
    onDelete: 'NO ACTION',
    foreignKey: {
        name: 'idCargo',
        allowNull: false,
        field: 'id_cargos'
    }
});


export default Usuario;