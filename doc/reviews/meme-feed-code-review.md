# Meme - Feed code review

## Observations

- The loader spins indefinitly: I waited for more than 7 min and I had to stop the process.
- I launch the test, they passed, but there are only a small pile of data, it does not transcribe reality.
- It seems that too many requests are exectuted blocking the display of the feed

## Causes

- Entering the page, a loop to fetch all existing memes is made. The loader is displayed until the query fetching all memes.
- For each retrieve meme:
  - Another request is made to retrieve its author
  - Another loop is launch to fetch all its comments
- For each retrieve comment, another request is made to retrieve its author

Number of requests made for one loop's iteration:
- List of 10 memes -> 1 request
- Author of memes -> 10 requests (1 by meme)
- List of comments -> At least 10 requests (1 by meme)
- Author of comments (If there are comments) -> At least 10 requests (1 by comment)

In total, for one iteration, at least 21 API requests are made (at least 31 if there are comments on each meme), breaking the user experience and forcing the user to kill the page.

It is way too many requests, knowing taht more than 1 iteration are made!

## Solutions

### Logics
#### Memes
- Instead of looping to fetch all memes in once, we will use a pagination system.
  - Entering the page, a first request to retrieve a page of memes will be made. 
  - The load for "more memes" will be triggered by a click to a button or with an infinite scroll
  - We can use the `useInfiniteQuery` of Tanstack, a solution built for this pattern

#### Comments
- Comments won't be load within the meme anymore. The load will be triggered with a pagination system.
  - After collapsing the comment section, a first request to retrieve a page of comments will be made (we could check if the `meme.commentsCount > 0` before loading comments, but because others users could have posted comments meantime, we want accurate data)
  - The load for "more comments" will be triggered by a click to a button or with an infinite scroll
  - We can use the `useInfiniteQuery` of Tanstack, a solution built for this pattern

#### Authors
- For retrieving authors, we will use the API endpoints `{api_url}/api/users` with the `ids` query params
  - It will allow us to retrieve all authors of a meme and a comment list in once, reducing API requests
  - They will be stored in cache (with `useQuery` of Tanstack), so before requesting the API, we will check into the stored data for existing authors

#### Expected results

- Entering the page, only 2 requests will be made (agains at least 21 for the current implementation):
  - One for fetching memes
  - One for fethcing authors of memes
- The feed should appear
- Actions like post a comment, read meme's comments or load more memes can be made

### Architecture
In order to keep the separation of concern, the scalability and in order to render the code more readable, the architechture will be a bit modified:
```
Project 
  ├── src/
      ├── __tests__/
      ├── assets/
      └── components/ -> UI components following Atomic design
          ├── atoms/
          ├── molecules/
          └── organisms/
      ├── config/
      ├── contexts/
      └── hooks/
          └── features/ -> Hooks for business logic
          ├── uesHook.tsx -> Utils hooks
          └── uesHook2.tsx
      ├── routes/
      ├── services/ -> API requests
      ├── types/ -> Shared types
      ├── main.tsx
      ├── routeTree.tsx
      └── vite-env.d.ts
  └── tests/
  ├── ...
```

  