'use strict';

const { permissions } = require('../../../lib/auth');

module.exports = function setupResolver (services) {
  const { PermisoService } = services;

  return {
    Query: {
      permisos: async (_, args, context) => {
        permissions(context, 'permisos:read');

        let lista = await PermisoService.findAll(args);
        return lista.data;
      },
      permiso: async (_, args, context) => {
        permissions(context, 'permisos:read');

        let item = await PermisoService.findById(args.id);
        return item.data;
      }
    },
    Mutation: {
      permisoAdd: async (_, args, context) => {
        permissions(context, 'permisos:create');

        args.permiso._user_created = context.id_usuario;
        let item = await PermisoService.createOrUpdate(args.permiso);
        return item.data;
      },
      permisoEdit: async (_, args, context) => {
        permissions(context, 'permisos:update');

        args.permiso._user_updated = context.id_usuario;
        args.permiso._updated_at = new Date();
        args.permiso.id = args.id;
        let item = await PermisoService.createOrUpdate(args.permiso);
        return item.data;
      },
      permisoDelete: async (_, args, context) => {
        permissions(context, 'permisos:delete');

        let deleted = await PermisoService.deleteItem(args.id);
        return { deleted: deleted.data };
      }
    }
  };
};
