import React from "react";
import { Spinner } from "react-bootstrap";
const Loding = () => {
  return (
    <div className="my-3 d-flex justify-content-center">
      <Spinner
        style={{
          width: "50px",
          height: "50px",
        }}
        animation="border"
      />
    </div>
  );
};

export default Loding;
