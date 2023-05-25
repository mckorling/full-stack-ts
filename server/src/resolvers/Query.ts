import { QueryResolvers } from '../resolvers-types.generated';
import { TwitterResolverContext } from '../resolvers';
import { tweetTransform } from '../transforms';
import { trendTransform } from '../transforms';

// type this to QueryResolvers so that it catches errors
// everything should match the generated file
const queryTwitterResolver: QueryResolvers<TwitterResolverContext> = {
  trends: (_, __, { db }) => {
    return db.getAllTrends().map(trendTransform);
  },
  currentUser: (_, __, { db }) => {
    const [firstUser] = db.getAllUsers(); // getting all users, but destructuring to get just the first
    if (!firstUser)
      // need to always return something because graphql schema requires User, so if there is no user, will throw an error
      throw new Error(
        'currentUser was requested, but there are no users in the database'
      );
    return firstUser;
  },
  suggestions: (_, __, { db }) => {
    return db.getAllSuggestions();
  },
  tweets: (
    // function, this is a resolver
    _, // parent argument, top level
    __, // args argument, if params are accepted, they would be here
    { db, dbTweetToFavoriteCountMap, dbUserCache, dbTweetCache } // context object
  ) => {
    db.getAllUsers().forEach((user) => {
      // iterate over all users, put them in cache, avoids having to requery db
      dbUserCache[user.id] = user;
    });
    db.getAllFavorites().forEach((favorite) => {
      const count = dbTweetToFavoriteCountMap[favorite.tweetId] || 0; // get current count from favorites or start at 0
      // users and tweets have a many to many relationship
      dbTweetToFavoriteCountMap[favorite.tweetId] = count + 1; // increment and put it back into map
      // map starts as empty, but then is added to and values are incrememented
    });
    return db.getAllTweets().map((t) => {
      // map over all tweets and cache, then transform and return
      dbTweetCache[t.id] = t;
      return tweetTransform(t);
      // returns graphql repr of tweet, with info on how many favorites each tweet has, all users, and all favorites
    });
  },
};

export default queryTwitterResolver;
