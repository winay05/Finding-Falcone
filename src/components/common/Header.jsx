import { Container, Navbar } from "react-bootstrap";

const Navigation = (props) => (
  <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
    <Container>
      <Navbar.Brand href="/">Finding Falcone</Navbar.Brand>
    </Container>
  </Navbar>
);
export default Navigation;
