# MERN Stack Reddit-Style Application

A full-stack web application built with the MERN stack (MongoDB, Express, React, and Node.js) that mimics key features of Reddit. This project focuses on efficient data fetching, scalability, performance optimizations, and up-to-date security practices.

## Table of Contents

- [Features](#features)
- [Highlights](#highlights)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Database Design and Scalability](#database-design-and-scalability)
- [Pagination & Filtering](#pagination--filtering)
- [Performance Optimizations](#performance-optimizations)
- [Technologies](#technologies)
- [Future Plans](#future-plans)
- [Contributing](#contributing)
- [License](#license)

## Features

- **User Auth**: Users can authenticate using JWTs.
- **Subreddits**: Users can view and create subreddits.
- **Posts**: Users can post to specific subreddits.
- **Comments**: Users can comment on posts and other comments.
- **Voting**: Users can upvote and downvote posts and comments.
- **Filtering**: Users can sort posts and comments by "Hot," "New," and "Top."

## Highlights

- **Efficient Data Fetching**: Uses `Promise.all` to handle multiple asynchronous queries for posts and comments, reducing overall load time.
- **Post Ranking**: Implements precomputed ranking scores (`rankingScore`, `netUpvotes`) to sort content efficiently based on "Hot," "New," and "Top" filters.
- **Database Throughput**: The application is designed to handle heavy read/write loads and supports the following throughput:
  - **8,000+ Transactions per Second (TPS)** for reads (screen views)
  - **5,500+ TPS** for page views
  - **1,000+ TPS** for upvotes
  - **10+ TPS** for post creation
  - A MongoDB sharding strategy is employed to distribute data across clusters (Posts/Subreddits, Votes, Comments, Users), ensuring scalability and fault tolerance.
- **Caching with Redis**: Implemented Redis for caching frequently accessed data (e.g., hot posts and comments) to further reduce load times and optimize performance.
- **Recursive Comment Fetching**: Server-side logic recursively fetches deeply nested comment threads, enabling seamless user interactions with replies and discussions.
- **Reusability**: Frontend components such as a `PaginatedList` can handle paginated views of different data (posts, comments, replies) for scalability.
- **Version & Security Updates**: Code is regularly updated to the latest package versions, resolving security vulnerabilities.

## Usage

The application supports Reddit-like functionality, including:

- Viewing, posting, and voting on posts.
- Threaded commenting with replies.
- Pagination and filtering of posts and comments, ranked using a custom algorithm for "Hot," "New," and "Top."

## API Endpoints

| Method | Endpoint                    | Description                                       |
| ------ | --------------------------- | ------------------------------------------------- |
| GET    | `/api/posts`                | Fetch all posts (supports pagination & filtering) |
| POST   | `/api/posts`                | Creates a new post                                |
| GET    | `/api/comments`             | Fetch top-level comments with pagination          |
| POST   | `/api/comments`             | Creates a new comment                             |
| GET    | `/api/comments/:id/replies` | Fetch replies to a specific comment               |
| POST   | `/api/votes`                | Creates a vote on a comment or post               |

## Database Design and Scalability

### Current Setup

The application currently uses a single MongoDB cluster managed by MongoDB Atlas with the following collections:

- **Users**
- **Posts**
- **Subreddits**
- **PostSubs** (a join table for posts and subreddits)
- **Comments**
- **Votes**

### Sharding Strategy

To prepare for scalability, I’m leveraging MongoDB’s built-in sharding features. For the traffic and workload outlined, sharding data across multiple clusters is crucial for scaling effectively. Here's the planned approach:

- **Posts & Subreddits**: Will be moved to a dedicated cluster with sharding based on `subredditId`. This ensures the high volume of post reads and writes is balanced.
- **Votes**: A separate cluster will handle vote data, partitioned by `postId`. With over 1,000 TPS for votes, this ensures fast, independent scaling.
- **Comments**: Managed in its own cluster, sharded by `postId`, since comments heavily depend on the posts they belong to and can grow recursively.
- **Users**: Stored in another cluster for user-related activities and data, sharded by `userId`.

This design isolates different high-traffic components of the application, reducing potential bottlenecks and optimizing for the read-heavy nature of the app. Given MongoDB's flexibility, the solution will allow the system to scale linearly as the user base grows.

---

For example:

```javascript
// Sharding keys for each collection:

db.posts.createIndex({ subredditId: 1 });
db.votes.createIndex({ postId: 1 });
db.comments.createIndex({ postId: 1 });
db.users.createIndex({ userId: 1 });
```

Each collection is sharded on the appropriate keys to handle heavy traffic efficiently, preventing read/write contention across different aspects of the platform.

## Pagination & Filtering

The app supports several filtering and pagination strategies to optimize performance:

- **Posts**:
  - Posts can be filtered by `Hot`, `New`, and `Top` categories.
  - Pagination relies on MongoDB query strategies (`.sort()`, `.limit()`), using precomputed scores for ranking.
- **Comments**:
  - Recursive server-side logic fetches nested comments, allowing deep-threaded conversations.
  - Comments are paginated, with dynamic filtering for reply counts and voting activity.

## Performance Optimizations

To ensure the app performs efficiently even with high traffic, the following optimizations have been incorporated:

- **Memoization**:
  - Using `useCallback` and `useMemo` to minimize unnecessary re-renders.
  - Leveraging Reselect’s `createSelector` to memoize `useSelector` calls in React.
- **Efficient Querying**:

  - `Promise.all` handles concurrent requests, improving response times when fetching multiple data sources.
  - Mongoose’s `.lean()` is used to return lightweight, plain JavaScript objects, reducing memory overhead.

- **Lazy Loading**:
  - Components are lazy-loaded with `React.lazy()` and `Suspense`, improving initial page load times and reducing bandwidth consumption.

## Technologies

- **MongoDB**: Used for database management with a sharding strategy to optimize scalability across posts, comments, votes, and users.
- **Express**: Server framework for handling API requests and routing.
- **React**: Frontend library for building interactive user interfaces.
- **Node.js**: Backend runtime for executing JavaScript on the server.
- **Redis**: Implemented as a caching layer to store frequently accessed data and reduce response times for read-heavy operations.
- **Mongoose**: ORM for MongoDB, used for schema definitions and efficient query handling.
- **JWT (JSON Web Tokens)**: Used for secure authentication of users.

## Future Plans

- Refactor for deployment on AWS Lambda.
- Explore using DynamoDB for further scalability and flexibility.
- Implement server-side caching and load balancing.
- Add CDN integration for faster content delivery.
- Implement user profiles with vote and post history.
- Expand validation and security features.
- Overhaul frontend design for a smoother, more intuitive experience.

## Spotted a bug?

If you find a bug, please open an issue [here](https://github.com/ckane30691/oldReddit/issues).
