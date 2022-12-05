# NBA Stats

A dashboard for searching through NBA players and looking at their stats.

## Features

- Auto-search bar by player name
- Pagination of players
- Player stats on each page
- Technologies used:
    - React
    - Material UI
    - React Router
    - `moment` for time
    - `awesome-debounce-promise` for debouncing API requests

## Design choices

- **Debounced search query** by 300ms. The API has a limit of 60 requests per minute, so the automatic search bar on text change might go over that limit without some debouncing. If needed we can make the search bar even quicker with no debouncing, but we don't have the rate limit capacity in the free API. It also seems silly to search 6 times when you type in something like `lebron`
- Search only by player name. The API doesn't support searching + pagination for other attributes, only player name.
- Past season stats are not easily retrievable and take too many requests, since we have to
  1. Find the seasons the player played in
  2. Then query EACH season, this could be a lot of requests which is bad
  3. We could potentially have like a "see more" for the season, but I think this is something the server side API should support better, to get the past season averages for the player

## Features I didn't get to

- Better error handling: right now errors just show up in the console or a 404 page shows
- Better display of missing data
- I think I might be unnecessarily rendering one of the pages, so it's hitting the API endpoint twice. Probably need to `useMemo` somewhere or just prevent rerendering.
- Frontend testing, maybe unit tests + e2e

## Screenshots

<img width="1420" alt="image" src="https://user-images.githubusercontent.com/12106484/205600798-9f2c62b6-821f-4b6f-80cf-21e62f10b2ba.png">
<img width="1416" alt="image" src="https://user-images.githubusercontent.com/12106484/205600656-2afc18f4-d037-4506-896c-1a0006a8ba11.png">
<img width="1018" alt="image" src="https://user-images.githubusercontent.com/12106484/205600745-46f2022e-933f-4a08-94b7-e62dc604139c.png">
