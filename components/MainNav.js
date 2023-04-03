import { Container, Nav, Navbar, Form, Button, NavDropdown } from "react-bootstrap";
import Link from 'next/link';
import {useRouter} from 'next/router';
import {useState, useEffect} from 'react';
import { useAtom } from "jotai";
import { searchHistoryAtom } from "../store";
import { addToHistory } from "../lib/userData";
import { readToken, removeToken } from "../lib/authenticate";

export default function MainNav(){
  const [searchField, setSearchField] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchHistory, setSearchHistory] = useAtom(searchHistoryAtom);
  const router = useRouter();

  const [token, setToken] = useState(null);
  const [userName, setUserName] = useState(null);

  useEffect(() => {
    const storedToken = readToken();
    setToken(storedToken);
    setUserName(storedToken ? storedToken.userName : null);
  }, []);

  async function submitForm(e){
    e.preventDefault();
    if(searchField != ""){
      router.push(`/artwork?title=true&q=${searchField}`);
      setSearchField("");
      setIsExpanded(false);
      setSearchHistory(await addToHistory(`title=true&q=${searchField}`)) 
    }
  }
  function logout() {
      setIsExpanded(false);
      removeToken();
      router.push("/login");
  }
  return (
    <>
    <Navbar expand="lg" className="fixed-top navbar-dark bg-primary" expanded={isExpanded} >
      <Container>
        <Navbar.Brand>Artem Pankov</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" onClick={()=>setIsExpanded(e => !e)} />
        <Navbar.Collapse id="basic-navbar-nav" >
          <Nav className="me-auto">
          <Nav.Item><Link href="/">Home</Link></Nav.Item>
          <Nav.Item><Link href="/search">Advanced Search</Link></Nav.Item>
          </Nav>
          &nbsp;
          <Form className="d-flex" onSubmit={submitForm}>
            <Form.Control
              type="search"
              placeholder="Search"
              className="me-2"
              aria-label="Search"
              value={searchField} onChange={(e) => setSearchField(e.target.value)}
            />
            <Button type="submit" variant="success">Search</Button>
          </Form>
          &nbsp;
          {token ? (
            <Nav>
              <NavDropdown title={userName} id="basic-nav-dropdown">
                <NavDropdown.Item>
                  <Link href="/favourites">Favourites</Link>
                </NavDropdown.Item>
                <NavDropdown.Item>
                <Link href="/history">History</Link>
                </NavDropdown.Item>
                <NavDropdown.Item onClick={logout}>Logout</NavDropdown.Item>
              </NavDropdown>
            </Nav>
          ) : (
            <Nav>
              <Nav.Item>
                <Link href="/register">Register</Link>
              </Nav.Item>
              <Nav.Item>
                <Link href="/login">Login</Link>
              </Nav.Item>
            </Nav>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
    <br /><br /><br />
    </>
  );
}

