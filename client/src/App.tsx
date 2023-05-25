import { isDefined } from '@full-stack-ts/shared';
import * as React from 'react';
import Header from './Header';
import LeftSidebar from './LeftSidebar';
import RightBar from './RightBar';
import Timeline from './Timeline';
import { gql } from '@apollo/client';
import { useGetCurrentUserQuery } from './generated/graphql';

const TRENDS = [
  {
    topic: 'Frontend Masters',
    tweetCount: 12345,
    title: 'Frontend Masters',
    description: 'Launch of new full stack TS course',
    imageUrl: 'http://localhost:3000/static/fem_logo.png',
  },
];

// gql template literal
export const GET_CURRENT_USER = gql`
  query GetCurrentUser {
    currentUser {
      id
      name
      handle
      avatarUrl
      createdAt
      stats {
        tweetCount
        followingCount
        followerCount
      }
      favorites {
        tweet {
          id
        }
      }
    }
    suggestions {
      name
      handle
      avatarUrl
      reason
    }
    trends {
      ... on TopicTrend {
        tweetCount
        topic
        quote {
          title
          imageUrl
          description
        }
      }
      ... on HashtagTrend {
        tweetCount
        hashtag
      }
    }
  }
`;
//... on TopicTrend syntax: tells gql what to do if a member matches on of these types, then in the braces tells the fields to be interested in

const App: React.FC = () => {
  // can conditionally render something
  // this hook doesn't need args
  const { loading, error, data } = useGetCurrentUserQuery();
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!data) return <p>No data.</p>;

  const { currentUser, suggestions = [], trends = [] } = data;

  const { favorites: rawFavorites } = currentUser;
  const favorites = (rawFavorites || [])
    .map((f) => f.tweet?.id)
    .filter(isDefined);
  const filteredTrends = trends.filter(isDefined);

  return (
    <div>
      <LeftSidebar currentUser={currentUser} />{' '}
      <Header currentUser={currentUser} />
      <div id="container" className="wrapper nav-closed">
        <Timeline
          currentUserId={currentUser.id}
          currentUserFavorites={favorites}
        />
        <RightBar trends={filteredTrends} suggestions={suggestions} />
      </div>
    </div>
  );
};
export default App;
