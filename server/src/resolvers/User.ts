import { TwitterResolverContext } from '../resolvers';
import { UserResolvers } from '../resolvers-types.generated';
import { favoriteTransform, tweetTransform } from '../transforms';

// User stats
// some fake values right now
const userTwitterResolver: UserResolvers<TwitterResolverContext> = {
  stats(user, _, { db }) {
    // top level query for currentUser, if someone has requested stats, then Query is called first
    // then what is returns is passed into here
    // we have access now to what was returned by top level resolver (we can call user.id)
    return {
      followingCount: 123,
      followerCount: 456789,
      tweetCount: db.getUserTweets(user.id).length, // get an array of tweets to show tweet count
    };
  },
  favorites(user, _, { db }) {
    const faves = db.getUserFavorites(user.id);
    return faves.map((f) => {
      return {
        // eslint-disable-next-line node/no-unsupported-features/es-syntax
        ...favoriteTransform(f),
        user,
        tweet: tweetTransform(db.getTweetById(f.tweetId)),
      };
    });
  },
};
export default userTwitterResolver;

// query example in apollo dev tools (https://studio.apollographql.com/sandbox/explorer)
// query Query {
//   currentUser {
//     stats {
//       followerCount
//       followingCount
//       tweetCount
//     }
//   }
// }
