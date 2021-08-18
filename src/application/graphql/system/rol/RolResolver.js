'use strict';
const { permissions } = require('../../../lib/auth');

module.exports = function setupResolver (services) {
  const { RolService } = services;

  return {
    Query: {
      roles: async (_, args, context) => {
        permissions(context, 'roles:read|usuarios:read');

        let items = await RolService.findAll(args, context.rol);
        return items.data;
      },
      rol: async (_, args, context) => {
        permissions(context, 'roles:read');

        let items = await RolService.findById(args.id);
        return items.data;
      }
    },
    Mutation: {
      rolAdd: async (_, args, context) => {
        permissions(context, 'roles:create');

        args.rol._user_created = context.id_usuario;
        let item = await RolService.createOrUpdate(args.rol);
        return item.data;
      },
      rolEdit: async (_, args, context) => {
        permissions(context, 'roles:update');

        args.rol._user_updated = context.id_usuario;
        args.rol._updated_at = new Date();
        args.rol.id = args.id;
        let item = await RolService.createOrUpdate(args.rol);
        return item.data;
      },
      rolDelete: async (_, args, context) => {
        permissions(context, 'roles:delete');

        let deleted = await RolService.deleteItem(args.id);
        return { deleted: deleted.data };
      }
    }
  };
};
