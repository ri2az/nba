import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Stats } from "../types";

export default function PlayerPage() {
  let { playerId } = useParams();
  useEffect(() => {
    fetch(`https://www.balldontlie.io/api/v1/stats?player_ids[]=${playerId}`)
      .then(response => {
        if (!response.ok) {
          throw new Error(
            `HTTP error: The status is ${response.status}`
          );
        }
        return response.json();
      })
      .then(data => {
        console.log(data);
        setData(data.data);
      })
      .catch(err => setError(err))
      .finally(() => setLoading(false));
  }, []);
  const [data, setData] = useState<Stats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  return <>{playerId}</>;
}
