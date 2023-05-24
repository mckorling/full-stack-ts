import Query from './resolvers/Query';
import Db from './db';
import { Resolvers } from './resolvers-types.generated';

// export because it is needed in other places
export interface TwitterResolverContext {
  db: Db;
}

// gets passed in to creating an apollo server, so it needs to come before
// need a resolver to gather things together and give something for graphql to emit,
// it gets organized into a response.like a reducer in redux
const resolvers: Resolvers<TwitterResolverContext> = {
  Query,
};

export default resolvers;
