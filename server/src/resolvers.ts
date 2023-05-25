import Query from './resolvers/Query';
import User from './resolvers/User';
import Tweet from './resolvers/Tweet';
import Mutation from './resolvers/Mutation';
import Trend from './resolvers/Trend';
import Db, { DbTweet, DbUser } from './db';
import { Resolvers } from './resolvers-types.generated';

// export because it is needed in other places
// this setup helps to reduce amount of queries, so that 'everything' can be grabbed in one pass through
export interface TwitterResolverContext {
  db: Db;
  dbTweetCache: Record<string, DbTweet>;
  dbUserCache: Record<string, DbUser>;
  dbTweetToFavoriteCountMap: Record<string, number>;
}

// gets passed in to creating an apollo server, so it needs to come before
// need a resolver to gather things together and give something for graphql to emit,
// it gets organized into a response.like a reducer in redux
const resolvers: Resolvers<TwitterResolverContext> = {
  Query,
  Tweet,
  User,
  Mutation,
  Trend,
};

export default resolvers;
