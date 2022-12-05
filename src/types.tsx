export type Player = {
  id: number,
  first_name: string,
  height_feet: number,
  height_inches: number,
  last_name: string,
  position: string,
  team: Team,
  weight_pounds: number,
}

export type Team = {
  id: number,
  abbreviation: string,
  city: string,
  conference: string,
  division: string,
  full_name: string,
  name: string,
}

export type NumberStats = "ast" | "pts" | "blk" | "reb" | "fg3_pct" | "fg_pct" | "min" | "stl" | "turnover";

export type Stats = {
  "id": number,
  "ast": number,
  "blk": number,
  "dreb": number,
  "fg3_pct": number,
  "fg3a": number,
  "fg3m": number,
  "fg_pct": number,
  "fga": number,
  "fgm": number,
  "ft_pct": number,
  "fta": number,
  "ftm": number,
  "game": Game,
  "min": string,
  "oreb": number,
  "pf": number,
  "player": Player,
  "pts": number,
  "reb": number,
  "stl": number,
  "team": Team
  "turnover": number
};

export type Metadata = {
  current_page: number,
  next_page: number,
  per_page: number,
  total_count: number,
  total_pages: number
};

export type Game = {
  "id": number,
  "date": string,
  "home_team_id": number,
  "home_team_score": number,
  "season": number,
  "visitor_team_id": number,
  "visitor_team_score": number
};

export type SeasonAverage = {
  "games_played": number,
  "player_id": number,
  "season": number,
  "min": string,
  "fgm": number,
  "fga": number,
  "fg3m": number,
  "fg3a": number,
  "ftm": number,
  "fta": number,
  "oreb": number,
  "dreb": number,
  "reb": number,
  "ast": number,
  "stl": number,
  "blk": number,
  "turnover": number,
  "pf": number,
  "pts": number,
  "fg_pct": number,
  "fg3_pct": number,
  "ft_pct": number
};

export type PlayerEndpoint = {
  data: Player[],
  meta: Metadata,
};
