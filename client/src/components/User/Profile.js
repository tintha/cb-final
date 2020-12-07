import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import * as actions from "../../redux/actions";
import { COLORS } from "../../contants";

const Profile = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.currentUser);
  const profile = useSelector((state) => state.profile.profile);
  const loadingStatus = useSelector((state) => state.profile.status);

  useEffect(() => {
    loadData();
  }, [user]);

  const loadData = async () => {
    try {
      dispatch(actions.requestProfile());
      const response = await fetch(`/api/users/${user}`);
      const data = await response.json();
      dispatch(actions.profileSuccess(data.data));
    } catch (err) {
      dispatch(actions.profileError(err));
    }
  };

  return (
    <Wrapper>
      <H2>Profile</H2>
      {loadingStatus === "loading" && <p>loading...</p>}
      {loadingStatus === "error" && <p>An error occurred...</p>}
      {loadingStatus === "success" && (
        <>
          <p>Username: {user}</p>
          <FieldBox>First Name: {profile.firstName}</FieldBox>
          <FieldBox>Last Name: {profile.lastName}</FieldBox>
          <FieldBox></FieldBox>
          <FieldBox>Address: {profile.address}</FieldBox>
          <FieldBox>
            <Button onClick={() => history.push("/user/profile/edit")}>
              Edit
            </Button>
          </FieldBox>
        </>
      )}
    </Wrapper>
  );
};

const Wrapper = styled.div``;

const H2 = styled.h2`
  font-size: 1rem;
  font-weight: bold;
`;

const FieldBox = styled.div``;

const Button = styled.button`
  width: 100%;
  background-color: ${COLORS.secondary};
  color: white;
  padding: 14px 20px;
  margin: 8px 0;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;

export default Profile;
