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

export type Game = {
  "id": number,
  "date": string,
  "home_team_id": number,
  "home_team_score": number,
  "season": number,
  "visitor_team_id": number,
  "visitor_team_score": number
};
