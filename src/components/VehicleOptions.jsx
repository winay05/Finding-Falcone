import React, { useEffect, useState } from "react";

const VehicleOptions = ({ vehicles, planet, destinationId, selectVehicle }) => {
  const [selected, changeSelect] = useState(-1);

  const isVehicleEligible = (vehicle) => {
    let result = true;

    if (vehicle?.max_distance < planet?.distance) result = false;
    if (vehicle?.total_no < 1) result = false;

    return result;
  };
  useEffect(() => {
    changeSelect(-1);
  }, []);
  return (
    <>
      {vehicles.map((vehicle, idx) => (
        <div
          key={idx}
          style={!isVehicleEligible(vehicle) ? { opacity: 0.5 } : {}}
        >
          <input
            checked={selected === idx}
            disabled={!isVehicleEligible(vehicle)}
            id={`vehicle-${idx}-${destinationId}`}
            type="radio"
            name={`vehicles-${destinationId}`}
            value={vehicle.name}
            onChange={(e) => {
              // console.log(idx);
              changeSelect(idx);
              selectVehicle(vehicle.name, destinationId);
            }}
          />
          <label htmlFor={`vehicle-${idx}-${destinationId}`}>
            {vehicle.name} ({vehicle.total_no})
          </label>
        </div>
      ))}
    </>
  );
};

export default VehicleOptions;
