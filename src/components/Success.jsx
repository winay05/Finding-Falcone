import { Button } from "react-bootstrap";
import React from "react";
import { Link, Redirect, withRouter } from "react-router-dom";

const Success = (props) => {
  return props.location.pathname.slice(1).split("/").length !== 3 ? (
    <Redirect to="/" />
  ) : (
    <>
      <h1>Success</h1>
      <p>Falcone found at {props.location.pathname.slice(1).split("/")[1]}</p>
      <Link to="/">
        <Button>Go back</Button>
      </Link>
    </>
  );
};

export default withRouter(Success);
