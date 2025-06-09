# Authentication - code review

## Observations

- When we sign in to the app, we are redirected to the meme feed (the homepage)
- If we reload the page, the authentication is lost and we are back to the login page
- We are never redirected to login if the token expires 

## Causes

- The authenticated data are store in the context, they are not persited in any other storage allowing us to retreive them after reload
- They are no check of jwt token expiration, or redirection on API unauthentication error response. 

## Solution

- After successfully authenticated to the API (with a jwt token), we will store auth data in localStorage
- On reload, we will look for auth data in the localStorage:
  - If some and they are valid, we keep the user authenticated
  - If not, we clean auth data and the user is redirected to login page
- On API unauthentication error response, we clean the localStorage and redirect to the login page
- We could add a check of token exp every x time, but I am not sure it wort it with this kind of authentication. 