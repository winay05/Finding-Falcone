import React, { useState } from "react";

const PlanetsDropDown = ({
  focusVehicleIdx,
  focusDestinationIdx,
  destinationId,
  planets,
  handleChange,
  children,
}) => {
  // console.log(planets);
  const [selected, ChangeSelect] = useState("select");
  const changeHandler = (e) => {
    ChangeSelect(e.target.value);
    handleChange(e.target.value, destinationId);
  };
  return (
    <>
      <select
        defaultValue={selected}
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

      {focusVehicleIdx >= destinationId ? children : null}
    </>
  );
};

export default PlanetsDropDown;
