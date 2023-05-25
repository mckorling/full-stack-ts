import { tweetTransform, favoriteTransform } from '../transforms';
import { TwitterResolverContext } from '../resolvers';
import { MutationResolvers } from '../resolvers-types.generated';

const mutationTwitterResolver: MutationResolvers<TwitterResolverContext> = {
  //async resolver
  // needs to return a tweet or a promise that resolves to a tweet
  // taking in args, which comes from the Mutation type in schema
  async createTweet(_parent, args, { dbTweetCache, db }) {
    const { body, userId } = args;
    const dbTweet = await db.createTweet({
      message: body,
      userId, // db creates the id?
    });
    const dbTweetMap = (dbTweetCache ||= {}); // reuse same caching object so that downstream resolvers can work
    // tweets have authors, in order to persist and return, they need to ahve the right things in them.?
    const dbAuthor = db.getUserById(userId);
    dbTweetMap[dbTweet.id] = dbTweet;
    if (!dbAuthor) throw new Error(`No author found for ${userId}`);
    return Object.assign(tweetTransform(dbTweet), { author: dbAuthor });
  },
  async createFavorite(_parent, args, { db }) {
    const { favorite } = args; // getting favorite as an argument
    const fav = await db.createFavorite(favorite);
    return {
      // eslint-disable-next-line node/no-unsupported-features/es-syntax
      ...favoriteTransform(fav),
      user: db.getUserById(fav.userId), // in real life would want to check validity of user gotten here
      tweet: tweetTransform(db.getTweetById(fav.tweetId)),
    };
  },
  async deleteFavorite(_parent, args, { db }) {
    const { favorite } = args;
    const fav = await db.deleteFavorite(favorite);
    return {
      // eslint-disable-next-line node/no-unsupported-features/es-syntax
      ...favoriteTransform(fav),
      user: db.getUserById(fav.userId),
      tweet: tweetTransform(db.getTweetById(fav.tweetId)),
    };
  },
};
export default mutationTwitterResolver;
