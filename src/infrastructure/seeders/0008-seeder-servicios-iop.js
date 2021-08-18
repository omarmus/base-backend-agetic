'use strict';

const { setTimestampsSeeder } = require('../lib/util');

let items = [
  {
    codigo: 'SEGIP-01',
    metodo: 'Buscar persona por cédula de identidad',
    descripcion: 'Servicio que busca una persona mediante su número de documento',
    entidad: 'SEGIP',
    url: 'https://interoperabilidad.agetic.gob.bo/fake/segip/v2/personas/',
    token: '<token-interoperabilidad>',
    tipo: 'CONVENIO',
    estado: 'ACTIVO'
  },
  {
    codigo: 'SEGIP-02',
    metodo: 'Contrastación de persona',
    descripcion: 'Servicio que contrasta una persona mediante los datos que se le envíe',
    entidad: 'SEGIP',
    url: 'https://interoperabilidad.agetic.gob.bo/fake/segip/v2/personas/contrastacion',
    token: '<token>',
    tipo: 'CONVENIO',
    estado: 'ACTIVO'
  },
  {
    codigo: 'FUNDEMPRESA-01',
    metodo: 'Buscar matrículas en base a un NIT',
    descripcion: 'Servicio que busca una persona mediante su número de documento',
    entidad: 'FUNDEMPRESA',
    url: 'https://interoperabilidad.agetic.gob.bo/fake/fundempresa/v1/nit/',
    token: '<token>',
    tipo: 'CONVENIO',
    estado: 'ACTIVO'
  },
  {
    codigo: 'SIN-01',
    metodo: 'Autentica en el servicio de SIN',
    descripcion: 'Servicio que autentica al Servicio del SIN con: nit, usuario y clave',
    entidad: 'SIN',
    url: 'https://interoperabilidad.agetic.gob.bo/fake/impuestos/v1/',
    token: '<token>',
    tipo: 'CONVENIO',
    estado: 'ACTIVO'
  },
  {
    codigo: 'PNE-01',
    metodo: 'Notificación electrónicas',
    descripcion: 'Servicio de notificaciones electrónicas',
    entidad: 'AGETIC',
    url: 'https://test.agetic.gob.bo/notificaciones-e/api/',
    token: '<token>',
    tipo: 'CONVENIO',
    estado: 'ACTIVO'
  }
];

// Asignando datos de log y timestamps a los datos
items = setTimestampsSeeder(items);

module.exports = {
  up (queryInterface, Sequelize) {
    if (process.env.IOP === 'true') {
      return queryInterface.bulkInsert('servicios_iop', items, {});
    } else {
      return Promise.resolve(true);
    }
  },

  down (queryInterface, Sequelize) { }
};
