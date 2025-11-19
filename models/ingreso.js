module.exports = (sequelize, DataTypes) => {
  const Ingreso = sequelize.define('Ingreso', {
    placa: {
      type: DataTypes.STRING,
      allowNull: false
    },
    tipoVehiculo: {
      type: DataTypes.STRING,
      allowNull: false
    },
    tipoAccesso: {
      type: DataTypes.STRING,
      allowNull: false
    },
    ticketPago: {
      type: DataTypes.STRING,
      allowNull: true
    },
    horaEntrada: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    horaSalida: {
      type: DataTypes.DATE,
      allowNull: true
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    tableName: 'ingresos',
    timestamps: false
  });

  return Ingreso;
};
