import React from "react";
import { withAuthorization } from "../Session";

const Home = () => (
  <div>
    <h1>Home</h1>
    <p>The Home Page is accessible by every signed in user.</p>
  </div>
);

const condition = (authUser: any) => !!authUser;
export default withAuthorization(condition)(Home);
