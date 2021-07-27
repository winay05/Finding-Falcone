import { Spinner } from "react-bootstrap";

const LoadingSpinner = () => (
  <div
    className="d-flex justify-content-center align-items-center"
    style={{
      position: "fixed",
      width: "100%",
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      backgroundColor: "rgba(255,255,255,0.7)",
      zIndex: 9999,
      display: "none",
    }}
  >
    <Spinner
      style={{ color: "blue", padding: "3rem", fontSize: 32 }}
      animation="border"
      role="status"
    >
      <span className="visually-hidden">Loading...</span>
    </Spinner>
  </div>
);

export default LoadingSpinner;
