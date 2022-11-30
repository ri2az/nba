import { useEffect, useState } from "react";
import { Player } from "../types";

export default function Root() {
  useEffect(() => {
    fetch('https://www.balldontlie.io/api/v1/players')
      .then(response => {
        if (!response.ok) {
          throw new Error(
            `HTTP error: The status is ${response.status}`
          );
        }
        return response.json();
      })
      .then(data => {
        console.log(data); setData(data.data)})
      .catch(err => setError(err))
      .finally(() => setLoading(false));
  }, []);
  const [data, setData] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState<string>("");
  return (<div>
    <div className="wrapper">
      <div className="search-wrapper">
        <label htmlFor="search-form">
          <input
            type="search"
            name="search-form"
            id="search-form"
            className="search-input"
            placeholder="Search for..."
            onChange={(e) => setQuery(e.target.value)}
          />
          <span className="sr-only">Search players here</span>
        </label>
      </div>
    </div>
    <div>Grid of players, filters when search is added</div>
    <div>Need to do pagination search</div>
    {loading && <div>A moment please...</div>}
    {data && data.map(e => <div>{e.first_name}</div>)}
  </div>);
}