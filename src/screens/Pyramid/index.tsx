import React, { useContext, useState } from "react";
import { useListVals } from "react-firebase-hooks/database";
import { FirebaseContext } from "../../components/Firebase";
import AuthUserContext from "../../components/Session/context";

interface Ranking {
  id: string;
  userId: string;
  username: string;
  rank: number;
}

const Pyramid = () => {
  const firebase = useContext(FirebaseContext);
  const authUser = useContext(AuthUserContext);
  const [rankings, loading, error] = useListVals<Ranking>(
    firebase?.db.ref("rankings"),
    {
      keyField: "id",
    }
  );

  return (
    <div>
      <h1>Pyramid</h1>
      {error && <strong>Error: {error}</strong>}
      {loading && <span>List: Loading...</span>}
      {rankings && (
        <ul>
          {rankings.map((ranking) => (
            <li key={ranking.id}>
              Rank:{ranking.rank}
              <br />
              Username: {ranking.username}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Pyramid;
