import { Button } from "react-bootstrap";
import React from "react";
import { Link, Redirect, withRouter } from "react-router-dom";

const Success = (props) => {
  return props.location.pathname.slice(1).split("/").length !== 4 ? (
    <Redirect to="/" />
  ) : (
    <>
      <h1>Success</h1>
      <p>
        Falcone found on{" "}
        <strong>{props.location.pathname.slice(1).split("/")[1]}</strong>{" "}
      </p>
      <p>
        Time Taken:{" "}
        <strong>{props.location.pathname.slice(1).split("/")[3]}</strong> hours
      </p>
      <Link to="/">
        <Button>Go back</Button>
      </Link>
    </>
  );
};

export default withRouter(Success);
