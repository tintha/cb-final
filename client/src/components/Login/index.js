import React, { useState } from "react";
import styled from "styled-components";
import { Redirect, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import * as actions from "../../redux/actions";
import { COLORS } from "../../contants";

const Login = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.currentUser);
  const userProfile = useSelector((state) => state.auth.userProfile);
  const error = useSelector((state) => state.auth.loginError);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(actions.requestLogin());
      const response = await fetch(`/api/users/login`, {
        method: "POST",
        body: JSON.stringify({ username: username, password: password }),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (data.status === 401) {
        dispatch(actions.loginError(data.message));
        setTimeout(() => {
          dispatch(actions.loginClearError());
        }, 2000);
      } else {
        dispatch(actions.loginSuccess(data.data));
      }
    } catch (err) {
      dispatch(actions.loginError(err));
    }
  };

  return (
    <Wrapper>
      {user ? (
        <>
          {userProfile.isAdmin === true ? (
            <Redirect to="/admin" />
          ) : (
            <Redirect to="/cart" />
          )}
        </>
      ) : (
        <>
          <p>
            Don't have an account? You can create one{" "}
            <Link to="/register">here</Link>.
          </p>
          <FieldBox>
            <label htmlFor="username">
              Username<br></br>
              <LoginInput
                type="text"
                name="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </label>
          </FieldBox>
          <FieldBox>
            <label htmlFor="password">
              Password<br></br>
              <LoginInput
                type="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>
          </FieldBox>
          <FieldBox>
            <Submit type="submit" onClick={(e) => handleSubmit(e)}>
              Login
            </Submit>
          </FieldBox>
          <Error>{error && <p>{error}</p>}</Error>
        </>
      )}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  font-family: "Roboto Condensed", sans-serif;
  align-items: center;
  & > p {
    margin: 20px;
  }

  @media only screen and (min-width: 992px) {
    /* desktop */
    max-width: 400px;
    margin: auto;
  }
`;

const LoginInput = styled.input`
  width: 100%;
  padding: 12px 20px;
  margin: 8px 0;
  display: inline-block;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
  background-color: ${COLORS.inputBackground};
  font-size: 1rem;
`;

const FieldBox = styled.div`
  display: flex;
  flex-direction: column;
  width: 90%;
`;

const Error = styled.div`
  display: flex;
  flex-direction: column;
  width: 90%;
  color: ${COLORS.error};
  font-weight: bold;
`;

const Submit = styled.button`
  width: 100%;
  background-color: ${COLORS.primary};
  color: #fff;
  padding: 14px 20px;
  margin: 8px 0;
  border: none;
  cursor: pointer;
  font-family: "Fredericka the Great", cursive;

  @media only screen and (min-width: 992px) {
    /* desktop */
    padding: 2px;
    width: 100px;
  }
`;

export default Login;
