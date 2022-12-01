import { useLoaderData, useParams } from "react-router-dom";

export default function PlayerPage() {
  let { playerId } = useParams();
  return <>{playerId}</>;
}
