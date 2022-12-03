import { Stats, SeasonAverage, Player } from "../types";

type PlayerCardProps = {
  player: Player
};

/**
 * A player component that displays some basic info about the player
 *
 * @param player Player data
 */
export default function PlayerCard({ player }: PlayerCardProps) {
  return <div>
    <div>
      {player.first_name} {player.last_name}
    </div>
    <div>
      Team: {player.team.full_name}
    </div>
    <div>
      Height: {player.height_feet}' {player.height_inches}"
    </div>
    <div>
      Weight: {player.weight_pounds} lbs
    </div>
  </div>;
}
