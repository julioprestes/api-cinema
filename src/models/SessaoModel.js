import { DataTypes } from "sequelize";
import { sequelize } from "../config/postgres.js";
import Sala from "./SalaModel.js";
import Filme from "./FilmeModel.js";

const Sessao = sequelize.define(
    'sessoes',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },

        lugares: {
            type: DataTypes.JSONB,
            allowNull: false
        },

        dataFim: {
            field: 'data_inicio',
            type: DataTypes.DATE,
            allowNull: false,
        },
        dataInicio: {
            field: 'data_fim',
            type: DataTypes.DATE,
            allowNull: false,
        },
        preco: {
            type: DataTypes.INTEGER,
            allowNull: false,
        }
    },
    {
        freezeTableName: true,
        timestamps: true,
        createdAt: 'create_at',
        updatedAt: 'updated_at',
    }
);

Sessao.belongsTo(Sala, {
    as: 'sala',
    onUpdate: 'NO ACTION',
    onDelete: 'NO ACTION',
    foreignKey: {
        name: 'idSala',
        allowNull: false,
        field: 'id_sala'
    }
});

Sessao.belongsTo(Filme, {
    as: 'padrao',
    onUpdate: 'NO ACTION',
    onDelete: 'NO ACTION',
    foreignKey: {
        name: 'idFilme',
        allowNull: false,
        field: 'id_filme'
    }
});


export default Sessao;