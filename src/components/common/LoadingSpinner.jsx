import { Spinner } from "react-bootstrap";

import "./common.css";

const LoadingSpinner = () => (
  <div className="spinner-container">
    <Spinner className="spinner" animation="border" role="status">
      <span className="visually-hidden">Loading...</span>
    </Spinner>
  </div>
);

export default LoadingSpinner;
