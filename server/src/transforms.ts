import { Tweet } from './resolvers-types.generated';
import { DbTweet, DbFavorite } from './db';
import { Favorite } from './resolvers-types.generated';
import { DbTrend } from './db';
import { Trend } from './resolvers-types.generated';

// take a db representation of a tweet (Dbtweet) and then putting it into a graphql representation
export const tweetTransform = (t: DbTweet): Omit<Tweet, 'author'> => {
  return {
    id: t.id,
    body: t.message,
    createdAt: t.createdAt,
    updatedAt: t.updatedAt,
  };
};

export const favoriteTransform = (
  t: DbFavorite
): Omit<Favorite, 'user' | 'tweet'> => {
  return {
    id: t.id,
    createdAt: t.createdAt,
    updatedAt: t.updatedAt,
  };
};

//kind is a discriminated union (?)
export const trendTransform = (t: DbTrend): Trend => {
  const { tweetCount } = t;
  if (t.kind === 'topic') {
    const { topic, quote } = t;
    return { tweetCount, topic, quote };
  } else {
    const { hashtag } = t;
    return { tweetCount, hashtag };
  }
};
