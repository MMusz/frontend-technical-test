# Meme - Feed code review

## Observations

- When posting a comment, it seems that nothing happens
- No test to check if the feature is working
- The meme's count of comments is still the same

## Causes

- On submit comment form, the comment is sent to the API, but nothing is made in case of success return (no reload, no append of comment...)

## Solution

- On mutate function (`useMutation`), before the API return any response. We will find the cached meme to optimisticly increased the count of comments
- On mutation function (`useMutation`), we will wait for the api response and update the comment feed, appending the new comment
- In case of error, we will rollback the update of comment counts on the cached meme