'use strict';

const debug = require('debug')('app:graphql');
const { ApolloServer } = require('apollo-server-express');
const auth = require('express-jwt');
const { config } = require('../../common');
const { verify } = require('../lib/auth');

module.exports = async function setupGraphql (app, services, graphql) {
  debug('Iniciando servidor GraphQL');

  // Agregando verificación con JWT
  app.use('/graphql', auth(config.auth));

  const rootQuery = `
    # Consultas Base
    type Query {
      ${graphql.queries.Query}
    }

    # Mutaciones Base
    type Mutation {
      ${graphql.queries.Mutation}
    }
  `;

  const server = new ApolloServer({
    typeDefs: [rootQuery].concat(graphql.schemes).join(''),
    resolvers: graphql.resolvers,
    formatError: (error) => {
      return {
        code: -1,
        data: error.name,
        message: error.message
      };
    },
    context: async ({ req }) => {
      let data;
      try {
        data = await verify(req.headers.authorization.replace('Bearer ', ''), config.auth.secret);

        // Obteniendo usuario
        const { UsuarioService } = services;
        let usuario = await UsuarioService.getUser(data.usuario, false);
        usuario = usuario.data;
 
        return {
          id_usuario: usuario.id,
          id_entidad: usuario.id_entidad,
          id_rol: usuario.id_rol,
          rol: usuario.rol.nombre,
          permissions: data.permissions,
          info: req.ipInfo
        };
      } catch (e) {
        throw new Error(e);
      }
    },
    playground: {
      endpoint: `http://localhost:3000/graphql`,
      settings: {
        'editor.theme': 'light'
      }
    }
  });

  server.applyMiddleware({ app, path: '/graphql' });

  // const schema = makeExecutableSchema({
  //   typeDefs: [rootQuery].concat(graphql.schemes),
  //   resolvers: graphql.resolvers
  // });
  // Creando endpoint de entrada de GraphQL
  // app.use('/graphql',
  //   graphqlExpress(req => ({
  //     schema,
  //     formatError: (error) => {
  //       return {
  //         code: -1,
  //         data: error.name,
  //         message: error.message
  //       };
  //     },
  //     context: req.context
  //   }))
  // );

  // Habilitando GraphiQL solo para desarrollo
  if (typeof process.env.NODE_ENV === 'undefined' || process.env.NODE_ENV !== 'production') {
    // app.use('/graphiql',
    //   graphiqlExpress({
    //     endpointURL: '/graphql'
    //   })
    // );
  }

  return app;
};
