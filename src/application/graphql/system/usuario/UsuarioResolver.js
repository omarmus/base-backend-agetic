'use strict';

const { permissions } = require('../../../lib/auth');

module.exports = function setupResolver (services) {
  const { UsuarioService } = services;

  return {
    Query: {
      usuarios: async (_, args, context) => {
        permissions(context, 'usuarios:read');

        let lista = await UsuarioService.findAll(args, context.rol, context.id_entidad);
        return lista.data;
      },
      usuario: async (_, args, context) => {
        permissions(context, 'usuarios:read');

        let item = await UsuarioService.findById(args.id);
        return item.data;
      },
      usuarioOnlyToken: async (_, args, context) => {
        let item = await UsuarioService.findById(args.id);
        return item.data;
      }
    },
    Mutation: {
      usuarioAdd: async (_, args, context) => {
        permissions(context, 'usuarios:create');

        args.usuario._user_created = context.id_usuario;
        let item = await UsuarioService.createOrUpdate(args.usuario, context.rol, context.id_entidad);
        return item.data;
      },
      usuarioEdit: async (_, args, context) => {
        permissions(context, 'usuarios:update');

        args.usuario._user_updated = context.id_usuario;
        args.usuario._updated_at = new Date();
        args.usuario.id = args.id;
        let item = await UsuarioService.createOrUpdate(args.usuario);
        return item.data;
      },
      usuarioUpdate: async (_, args, context) => {
        permissions(context, 'usuarios:update');

        args.usuario._user_updated = context.id_usuario;
        args.usuario._updated_at = new Date();
        args.usuario.id = args.id;
        let item = await UsuarioService.update(args.usuario);
        return item.data;
      },
      usuarioDelete: async (_, args, context) => {
        permissions(context, 'usuarios:delete');

        let deleted = await UsuarioService.deleteItem(args.id);
        return { deleted: deleted.data };
      }
    }
  };
};
