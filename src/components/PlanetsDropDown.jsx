import React, { useEffect, useState } from "react";

const PlanetsDropDown = ({
  focusVehicleIdx,
  focusDestinationIdx,
  destinationId,
  planets,
  handleChange,
  children,
}) => {
  const [selected, ChangeSelect] = useState("select");
  const changeHandler = (e) => {
    ChangeSelect(e.target.value);
    handleChange(e.target.value, destinationId);
  };
  useEffect(() => {
    ChangeSelect("select");
  }, []);
  return (
    <>
      <select
        value={selected}
        disabled={!planets || destinationId > focusDestinationIdx}
        onChange={changeHandler}
      >
        <option disabled key="-1" value="select">
          Select
        </option>
        {planets &&
          planets.map((planet, idx) => (
            <option key={idx} value={planet.name}>
              {planet.name}
            </option>
          ))}
      </select>

      {focusVehicleIdx >= destinationId ? <div>{children}</div> : null}
    </>
  );
};

export default PlanetsDropDown;
