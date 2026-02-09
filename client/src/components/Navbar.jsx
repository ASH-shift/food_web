import React, { useState } from "react";
import styled from "styled-components";
import { Link as LinkR, NavLink } from "react-router-dom";
import LogoImg from "../utils/Images/Logo.png";
import {
  FavoriteBorder,
  MenuRounded,
  SearchRounded,
  ShoppingCartOutlined,
} from "@mui/icons-material";
import Button from "./Button";
import { Avatar } from "@mui/material";
import { useDispatch } from "react-redux";
import { logout } from "../redux/reducers/UserSlice";

const Nav = styled.div`
  background-color: ${({ theme }) => theme.bg};
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: sticky;
  top: 0;
  z-index: 10;
`;

const NavContainer = styled.div`
  width: 100%;
  max-width: 1400px;
  padding: 0 24px;
  display: flex;
  gap: 14px;
  align-items: center;
  justify-content: space-between;
`;

const NavLogo = styled(LinkR)`
  display: flex;
  align-items: center;
`;

const Logo = styled.img`
  height: 34px;
`;

const NavItems = styled.ul`
  display: flex;
  align-items: center;
  gap: 32px;
  list-style: none;

  @media screen and (max-width: 768px) {
    display: none;
  }
`;

const Navlink = styled(NavLink)`
  color: ${({ theme }) => theme.text_primary};
  font-weight: 500;
  text-decoration: none;

  &.active {
    color: ${({ theme }) => theme.primary};
    border-bottom: 2px solid ${({ theme }) => theme.primary};
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 20px;
  align-items: center;

  @media screen and (max-width: 768px) {
    display: none;
  }
`;

const MobileIcon = styled.div`
  display: none;

  @media screen and (max-width: 768px) {
    display: block;
  }
`;

const MobileMenu = styled.ul`
  position: absolute;
  top: 80px;
  right: 0;
  background: ${({ theme }) => theme.card_light};
  padding: 20px;
  list-style: none;
  display: ${({ isOpen }) => (isOpen ? "flex" : "none")};
  flex-direction: column;
  gap: 16px;
`;

const TextButton = styled.span`
  cursor: pointer;
  font-weight: 600;
`;

const Navbar = ({ setOpenAuth, currentUser }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();

  return (
    <Nav>
      <NavContainer>
        <MobileIcon onClick={() => setIsOpen(!isOpen)}>
          <MenuRounded />
        </MobileIcon>

        <NavLogo to="/">
          <Logo src={LogoImg} />
        </NavLogo>

        {/* Desktop Menu */}
        <NavItems>
          <Navlink to="/">Home</Navlink>
          <Navlink to="/dishes">Dishes</Navlink>
          <Navlink to="/orders">Orders</Navlink>
          <Navlink to="/contact">Contact</Navlink>

          {/* ⭐ Admin Button */}
          {currentUser?.role === "admin" && (
            <Navlink to="/admin">Admin</Navlink>
          )}
        </NavItems>

        {/* Desktop Right Icons */}
        <ButtonContainer>
          <Navlink to="/search">
            <SearchRounded />
          </Navlink>

          {currentUser ? (
            <>
              <Navlink to="/favorite">
                <FavoriteBorder />
              </Navlink>

              <Navlink to="/cart">
                <ShoppingCartOutlined />
              </Navlink>

              <Avatar src={currentUser?.img}>
                {currentUser?.name?.[0]}
              </Avatar>

              <TextButton onClick={() => dispatch(logout())}>
                Logout
              </TextButton>
            </>
          ) : (
            <Button text="Sign In" small onClick={() => setOpenAuth(true)} />
          )}
        </ButtonContainer>

        {/* Mobile Menu */}
        <MobileMenu isOpen={isOpen}>
          <Navlink to="/" onClick={() => setIsOpen(false)}>
            Home
          </Navlink>

          <Navlink to="/dishes" onClick={() => setIsOpen(false)}>
            Dishes
          </Navlink>

          <Navlink to="/orders" onClick={() => setIsOpen(false)}>
            Orders
          </Navlink>

          <Navlink to="/contact" onClick={() => setIsOpen(false)}>
            Contact
          </Navlink>

          {/* ⭐ Mobile Admin Button */}
          {currentUser?.role === "admin" && (
            <Navlink to="/admin" onClick={() => setIsOpen(false)}>
              Admin
            </Navlink>
          )}

          {currentUser ? (
            <TextButton onClick={() => dispatch(logout())}>
              Logout
            </TextButton>
          ) : (
            <Button text="Sign In" small onClick={() => setOpenAuth(true)} />
          )}
        </MobileMenu>
      </NavContainer>
    </Nav>
  );
};

export default Navbar;
