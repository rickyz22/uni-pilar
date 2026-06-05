'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('careers', [
      {
        id: Sequelize.literal('gen_random_uuid()'),
        name: 'Contador Público Nacional',
        code: 'CPN',
        duration: 5,
        description: 'Formación en contabilidad, auditoría, impuestos y finanzas públicas.',
        active: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: Sequelize.literal('gen_random_uuid()'),
        name: 'Licenciatura en Administración',
        code: 'LAD',
        duration: 4,
        description: 'Gestión empresarial, recursos humanos, marketing y estrategia.',
        active: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: Sequelize.literal('gen_random_uuid()'),
        name: 'Licenciatura en Higiene y Seguridad en el Trabajo',
        code: 'HST',
        duration: 4,
        description: 'Prevención de riesgos laborales, seguridad industrial y salud ocupacional.',
        active: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: Sequelize.literal('gen_random_uuid()'),
        name: 'Tecnicatura en Enfermería',
        code: 'TEN',
        duration: 3,
        description: 'Formación en cuidados de salud, asistencia médica y emergencias.',
        active: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: Sequelize.literal('gen_random_uuid()'),
        name: 'Abogacía',
        code: 'ABG',
        duration: 5,
        description: 'Ciencias jurídicas, derecho civil, penal, laboral y constitucional.',
        active: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('careers', null, {});
  }
};
