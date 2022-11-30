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