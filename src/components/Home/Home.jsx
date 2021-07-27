import React, { Component } from "react";
import { Col, Container, Row, Button, Spinner } from "react-bootstrap";

import { apiEndpoint, COUNT } from "../../util/config";
import { makeGetRequest, makePostRequest } from "../../util/callApi";
import PlanetsDropDown from "../PlanetsDropDown";
import VehicleOptions from "../VehicleOptions";
import { Redirect } from "react-router-dom";
import LoadingSpinner from "../common/LoadingSpinner";

export default class Home extends Component {
  constructor() {
    super();
    this.planets = [];
    this.vehicles = [];

    this.found = false;

    this.state = {
      token: "",
      selectedPlanets: [""],
      selectedVehicles: [""],
      availablePlanets: [""], //to keep history of available planets to all the menus
      availableVehicles: [""],
      focusDestinationIdx: 0,
      focusVehicleIdx: -1,
      time: 0,
      loading: false,
      found: false,
      location: "",
    };
  }

  getToken = async () => {
    let res = await makePostRequest(apiEndpoint.token, {}, "token");
    if (res) {
      return res.token;
    }
    return null;
  };
  getPlanets = async () => {
    let res = await makeGetRequest(apiEndpoint.planets, "planets");
    if (res && res.length > 0) return res;
    return null;
  };
  getVehicles = async () => {
    let res = await makeGetRequest(apiEndpoint.vehicles, "vehicles");
    if (res && res.length > 0) return res;
    return null;
  };
  findFalcone = async () => {
    if (
      this.state.selectedVehicles.length !== 4 ||
      this.state.selectedPlanets.length !== 4
    ) {
      alert("select all the destinations first");
      return false;
    }
    let body = {
      token: this.state.token,
      planet_names: this.state.selectedPlanets,
      vehicle_names: this.state.selectedVehicles,
    };
    // console.log(body);
    this.setState({ loading: true });
    let res = await makePostRequest(apiEndpoint.find, body, "result");
    if (res && res.status === "success") {
      this.found = true;
      // this.foundAt= res.planet_name;
      this.setState({ loading: false, found: true, location: res.planet_name });
      // alert(`Found Falcone at ${res.planet_name}`);
      return true;
    }
    this.setState({ loading: false });
    alert("failed to find Falcone!");
    return false;
  };

  reset = () => {
    this.setState({
      selectedPlanets: [""],
      selectedVehicles: [""],
      availablePlanets: [""],
      availableVehicles: [""],
      focusDestinationIdx: 0,
      focusVehicleIdx: -1,
      time: 0,
    });

    let newAvailable = this.state.availablePlanets;
    newAvailable[0] = [...this.planets];
    this.setState({ availablePlanets: [...newAvailable] });

    newAvailable = this.state.availableVehicles;
    newAvailable[0] = [...this.vehicles];
    this.setState({ availableVehicles: [...newAvailable] });
  };
  async componentDidMount() {
    this.setState({ loading: true });
    let res;
    res = await this.getPlanets();
    if (res) this.planets = [...res];

    res = await this.getVehicles();
    if (res) this.vehicles = [...res];

    res = await this.getToken();
    if (res) this.setState({ token: res });

    let newAvailable = this.state.availablePlanets;
    newAvailable[0] = [...this.planets];
    this.setState({ availablePlanets: [...newAvailable] });

    newAvailable = this.state.availableVehicles;
    newAvailable[0] = [...this.vehicles];
    this.setState({ availableVehicles: [...newAvailable] });
    this.setState({ loading: false });
  }
  handleChange = (planetName, destinationId) => {
    // console.log("inside change Handler, home");
    let newSelected = [...this.state.selectedPlanets];
    newSelected[destinationId] = planetName;

    let newAvailable = this.state.availablePlanets;
    newAvailable[destinationId + 1] = this.planets.filter(
      (e) => newSelected.indexOf(e.name) < 0
    );

    this.setState(
      {
        selectedPlanets: [...newSelected],
        focusVehicleIdx: destinationId,
        availablePlanets: [...newAvailable],
      },
      () => console.log(this.state)
    );
  };

  getLeftPlanets = () => {
    let bitmMask = this.planets.map(
      (el) => this.state.selectedPlanets.indexOf(el) >= 0
    );
    let arr = this.planets.map((el, idx) => (
      <option disabled={bitmMask[idx]} value={idx}>
        {el.name}
      </option>
    ));
    arr = [<option value="select">Select</option>, ...arr];
    return arr;
  };

  getLeftVehicles = () => {
    let leftVehicles = [...this.vehicles];
    const vehicleMap = new Map();
    this.state.selectedVehicles.forEach((element) => {
      let x = 0;
      if (vehicleMap.get(element)) x = vehicleMap.get(element);

      vehicleMap.set(element, x + 1);
    });
    leftVehicles = leftVehicles.map((el) => {
      const x = vehicleMap.get(el.name);
      if (x) {
        return { ...el, total_no: el.total_no - x };
      } else return { ...el };
    });

    return leftVehicles;
  };

  calculateTime = (vehicleName) => {
    let t = 0;

    for (let i = 0; i < this.state.selectedPlanets.length; ++i) {
      const planetName = this.state.selectedPlanets[i];

      const planet = this.planets.find((e) => e.name === planetName);
      const vehicle = this.vehicles.find((e) => e.name === vehicleName);
      t += (1 * (planet.distance * 1)) / (vehicle.speed * 1);
    }

    return t;
  };
  selectVehicle = (vehicleName, destinationId) => {
    // console.log("inside change Handler, home");
    let newSelected = [...this.state.selectedVehicles];
    newSelected[destinationId] = vehicleName;

    let newAvailable = this.state.availableVehicles;
    newAvailable[destinationId + 1] = newAvailable[destinationId].map((e) => {
      if (e.name === vehicleName) {
        return {
          ...e,
          total_no: Math.max(0, e.total_no - 1),
        };
      } else {
        return { ...e };
      }
    });
    this.vehicles = [...newAvailable[destinationId + 1]];
    this.setState(
      {
        selectedVehicles: [...newSelected],
        focusDestinationIdx: destinationId + 1,
        availableVehicles: [...newAvailable],
        time: this.calculateTime(vehicleName),
      },
      () => console.log(this.state)
    );
  };
  render() {
    return (
      <>
        {this.state.loading ? <LoadingSpinner /> : null}

        {this.state.found ? (
          <Redirect
            to={`/success/${this.state.location}/${this.state.token}`}
          />
        ) : (
          <>
            <Container style={{ minHeight: "500px" }}>
              <h1>Finding Falcone!</h1>
              <p>Select the planets you want to search in</p>
              <Row>
                <Col className="ml-auto ">
                  <h1>Time Taken: {this.state.time}</h1>
                </Col>
              </Row>
              <Row>
                {/* prints the req no of dropdowns, in this case, 4 */}
                {[...Array(COUNT.maxDestinations).keys()].map(
                  (destinationId) => (
                    <Col key={destinationId} sm={3}>
                      <PlanetsDropDown
                        focusDestinationIdx={this.state.focusDestinationIdx}
                        focusVehicleIdx={this.state.focusVehicleIdx}
                        destinationId={destinationId}
                        handleChange={this.handleChange}
                        planets={this.state.availablePlanets[destinationId]}
                      >
                        <VehicleOptions
                          destinationId={destinationId}
                          planet={this.planets.find(
                            (el) =>
                              el.name ===
                              this.state.selectedPlanets[destinationId]
                          )}
                          vehicles={this.state.availableVehicles[destinationId]}
                          selectVehicle={this.selectVehicle}
                        />
                      </PlanetsDropDown>
                    </Col>
                  )
                )}
              </Row>
            </Container>
            <Button
              disabled={
                this.state.selectedVehicles.length < COUNT ? true : false
              }
              onClick={this.findFalcone}
            >
              Find Falcone
            </Button>
          </>
        )}
      </>
    );
  }
}
