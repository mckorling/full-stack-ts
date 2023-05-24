import { QueryResolvers } from '../resolvers-types.generated';
import { TwitterResolverContext } from '../resolvers';

// type this to QueryResolvers so that it catches errors
// everything should match the generated file
const queryTwitterResolver: QueryResolvers<TwitterResolverContext> = {
  currentUser: () => {
    return {
      id: '123',
      name: 'John Doe',
      handle: 'johndoe',
      coverUrl: '',
      avatarUrl: '',
      createdAt: '',
      updatedAt: '',
    };
  },
  suggestions: (_, __, { db: _db }) => {
    return [
      {
        name: 'TypeScript Project',
        handle: 'TypeScript',
        avatarUrl: 'http://localhost:3000/static/ts-logo.png',
        reason: 'Because you follow @MichaelLNorth',
        id: '1',
      },
      {
        name: 'jQuery',
        handle: 'jquery',
        avatarUrl: 'http://localhost:3000/static/jquery-logo.jpeg',
        reason: 'Because you follow @FrontendMasters',
        id: '2',
      },
    ];
  },
};

export default queryTwitterResolver;