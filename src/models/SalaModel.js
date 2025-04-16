import { DataTypes } from "sequelize";
import { sequelize } from "../config/postgres.js";
import PadraoLugares from "./PadraoModel.js";

const Sala = sequelize.define(
    'salas',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        observacao: {
            type: DataTypes.TEXT,
        }
    },
    {
        freezeTableName: true,
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
);

Sala.belongsTo(PadraoLugares, {
    as: 'padrao',
    onUpdate: 'NO ACTION',
    onDelete: 'NO ACTION',
    foreignKey: {
        name: 'idPadraoLugares',
        allowNull: false,
        field: 'id_padrao_lugares'
    }
});

export default Sala;