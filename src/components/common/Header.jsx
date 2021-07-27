import { Container, Nav, Navbar } from "react-bootstrap";

const Navigation = (props) => (
  <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
    <Container>
      <Navbar.Brand href="/">Finding Falcone</Navbar.Brand>
      <Nav>
        <Nav.Link eventKey={2} href="https://www.geektrust.in">
          GeekTrust Home
        </Nav.Link>
      </Nav>
    </Container>
  </Navbar>
);
export default Navigation;
