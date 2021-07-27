import React, { Component } from "react";
import { Col, Container, Row, Button } from "react-bootstrap";

import { apiEndpoint, COUNT } from "../../util/config";
import { makeGetRequest, makePostRequest } from "../../util/callApi";
import PlanetsDropDown from "../PlanetsDropDown";
import VehicleOptions from "../VehicleOptions";
import { Redirect } from "react-router-dom";
import LoadingSpinner from "../common/LoadingSpinner";

import "./Home.css";

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
      currentVehicles: [],
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
    this.reset();
    return false;
  };

  reset = () => {
    this.setState({
      selectedPlanets: [""],
      selectedVehicles: [""],
      availablePlanets: [""],
      availableVehicles: [""],
      currentVehicles: this.vehicles,
      focusDestinationIdx: 0,
      focusVehicleIdx: -1,
      time: 0,
    });

    let newAvailablePlanets = [
      this.planets,
      ...this.state.availablePlanets,
    ].slice(0, 1);

    let newAvailableVehicles = [
      this.vehicles,
      ...this.state.availableVehicles,
    ].slice(0, 1);

    this.setState(
      {
        availablePlanets: newAvailablePlanets,
        availableVehicles: newAvailableVehicles,
      }
      // () => console.log(this.state)
    );
    // this.setState({  });
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
    this.setState({ currentVehicles: this.vehicles });
    this.setState({ loading: false });
  }
  handleChange = (planetName, destinationId) => {
    let newSelected = [...this.state.selectedPlanets];
    newSelected[destinationId] = planetName;
    // newSelected = newSelected.slice(0, destinationId + 1);
    let newAvailable = this.state.availablePlanets;
    newAvailable[destinationId + 1] = this.planets.filter(
      (e) => newSelected.indexOf(e.name) < 0
    );

    this.setState(
      {
        selectedPlanets: [...newSelected],
        focusVehicleIdx: destinationId,
        availablePlanets: [...newAvailable],
      }
      // () => console.log(this.state)
    );

    // to take care of situtaion in which a back destination is selected

    if (destinationId < this.state.focusDestinationIdx) {
      //take [0,idx] selected planets
      newSelected = newSelected.slice(0, destinationId + 1);
      //take [0, idx-1] selected vehicles
      let newSelectedVehicles = this.state.selectedVehicles.slice(
        0,
        destinationId
      );

      //take [0, idx+1] available planets
      newAvailable = newAvailable.slice(0, destinationId + 2);
      // take [0,idx-1] available vehicles
      let newAvailableVehicles = this.state.availableVehicles.slice(
        0,
        destinationId + 1
      );
      ///restore the currentVehicle state to all the last available vehicles
      let newCurrentVehicles = [...newAvailableVehicles[destinationId]];
      this.setState(
        {
          focusDestinationIdx: destinationId,
          selectedPlanets: [...newSelected],
          focusVehicleIdx: destinationId,
          availablePlanets: [...newAvailable],
          availableVehicles: [...newAvailableVehicles],
          selectedVehicles: [...newSelectedVehicles],
          currentVehicles: newCurrentVehicles,
        }
        // () => console.log(this.state)
      );
    }
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

    this.setState(
      {
        currentVehicles: [...newAvailable[destinationId + 1]],
        selectedVehicles: [...newSelected],
        focusDestinationIdx: destinationId + 1,
        availableVehicles: [...newAvailable],
        time: this.calculateTime(vehicleName),
      }
      // () => console.log(this.state)
    );
  };
  render() {
    return (
      <>
        {this.state.loading ? <LoadingSpinner /> : null}

        {this.state.found ? (
          <Redirect
            to={`/success/${this.state.location}/${this.state.token}/${this.state.time}`}
          />
        ) : (
          <>
            <Container>
              <Row>
                <div className="nav-button-container">
                  <Button variant="light" onClick={this.reset}>
                    Reset
                  </Button>
                  <span className="divider" />
                  <a className="btn btn-light" href="https://www.geektrust.in">
                    Geektrust Home
                  </a>
                </div>
              </Row>

              <h1>Finding Falcone!</h1>
              <p>Select the planets you want to search in</p>
              <Row>
                <Col>
                  <h4
                    style={{
                      width: "fit-content",
                      marginLeft: "auto",
                      marginBottom: "1.5rem",
                    }}
                  >
                    Time Taken: {this.state.time}
                  </h4>
                </Col>
              </Row>
              <Row className="options-container">
                {/* prints the req no of dropdowns, in this case, 4 */}
                {[...Array(COUNT.maxDestinations).keys()].map(
                  (destinationId) => (
                    <Col
                      className="dropdown-container"
                      key={destinationId}
                      md={3}
                    >
                      {destinationId > this.state.focusDestinationIdx ? (
                        <select disabled>
                          <option>Select</option>
                        </select>
                      ) : (
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
                            vehicles={
                              this.state.availableVehicles[destinationId]
                            }
                            selectVehicle={this.selectVehicle}
                          />
                        </PlanetsDropDown>
                      )}
                    </Col>
                  )
                )}
              </Row>

              <Button
                style={{ marginBottom: "5rem" }}
                disabled={
                  this.state.selectedVehicles.length < COUNT ? true : false
                }
                onClick={this.findFalcone}
              >
                Find Falcone
              </Button>
            </Container>
          </>
        )}
      </>
    );
  }
}
