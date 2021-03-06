import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { useToasts } from "react-toast-notifications";
import styled from "styled-components";
import * as actions from "../../redux/actions";
import { COLORS } from "../../contants";
import Loading from "../Loading";

const EditProfile = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const { addToast } = useToasts();
  const user = useSelector((state) => state.auth.currentUser);
  const profile = useSelector((state) => state.auth.userProfile);
  const loadingStatus = useSelector((state) => state.auth.status);
  const [updatedProfile, setUpdatedProfile] = useState({
    _id: profile._id,
    firstName: profile.firstName,
    lastName: profile.lastName,
    email: profile.email,
    address: {
      line1: profile.address.line1 || "",
      city: profile.address.city || "",
      postalCode: profile.address.postalCode || "",
    },
  });

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    if (name === "line1" || name === "city" || name === "postalCode") {
      const newAddress = { ...updatedProfile.address, [name]: value };
      setUpdatedProfile({ ...updatedProfile, address: { ...newAddress } });
    } else {
      setUpdatedProfile({ ...updatedProfile, [name]: value });
    }
  };

  const handleUpdateProfile = async (e) => {
    const id = user;
    e.preventDefault();
    try {
      const response = await fetch(`/api/users/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ ...updatedProfile }),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (data.status === 200) {
        addToast("Profile updated", {
          appearance: "success",
          autoDismiss: true,
        });
        dispatch(actions.userProfileUpdated({ ...updatedProfile }));
        history.push("/user/profile");
      } else if (data.status === 400) {
        addToast(data.message, {
          appearance: "error",
        });
      }
    } catch (err) {
      addToast(err, {
        appearance: "error",
      });
    }
  };

  const handleCancel = (e) => {
    e.preventDefault();
    history.push("/user/profile");
  };

  return (
    <Wrapper>
      <H1>Edit your account information</H1>
      {loadingStatus === "loading" && <Loading />}
      {loadingStatus === "error" && <p>An error occurred...</p>}
      {loadingStatus === "success" && (
        <>
          <p>Username: {user}</p>
          <FieldBox>
            <label htmlFor="firstName">
              *First Name:{" "}
              <Input
                id="firstName"
                type="text"
                name="firstName"
                value={updatedProfile.firstName}
                onChange={handleChange}
              />
            </label>
          </FieldBox>
          <FieldBox>
            <label htmlFor="lastName">
              *Last Name:
              <Input
                id="lastName"
                type="text"
                name="lastName"
                value={updatedProfile.lastName}
                onChange={handleChange}
              />
            </label>
          </FieldBox>
          <FieldBox>
            <label htmlFor="email">
              *Email:
              <Input
                id="email"
                type="text"
                name="email"
                value={updatedProfile.email}
                onChange={handleChange}
              />
            </label>
          </FieldBox>
          <FieldBox>
            <label htmlFor="address">
              Address:
              <Input
                id="address"
                type="text"
                name="line1"
                value={updatedProfile.address.line1}
                onChange={handleChange}
              />
            </label>
          </FieldBox>
          <FieldBox>
            <label htmlFor="city">
              City:
              <Input
                id="city"
                type="text"
                name="city"
                value={updatedProfile.address.city}
                onChange={handleChange}
              />
            </label>
          </FieldBox>
          <FieldBox>
            <label htmlFor="postalCode">
              Postal Code:
              <Input
                id="postalCode"
                type="text"
                name="postalCode"
                value={updatedProfile.address.postalCode}
                onChange={handleChange}
              />
            </label>
          </FieldBox>
          <FieldBox>
            <Buttons>
              <Button
                onClick={(e) => handleUpdateProfile(e)}
                aria-label="Save profile changes"
              >
                Save changes
              </Button>
              <Button
                onClick={(e) => handleCancel(e)}
                aria-label="Cancel and go back to profile page"
              >
                Cancel
              </Button>
            </Buttons>
          </FieldBox>
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
  width: 100%;
  color: ${COLORS.darkest};

  & > p {
    margin: 20px;
  }

  @media only screen and (min-width: 992px) {
    max-width: 400px;
    margin: auto;
  }
`;

const H1 = styled.h1`
  font-size: 1rem;
  font-weight: bold;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 12px;
  margin: 8px 0;
  display: inline-block;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
  font-size: 1rem;
  background-color: ${COLORS.inputBackground};
`;

const FieldBox = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const Buttons = styled.div`
  display: flex;
  flex-wrap: nowrap;
  width: 100%;
`;

const Button = styled.button`
  width: 100%;
  background-color: ${COLORS.primary};
  color: #fff;
  padding: 14px 14px;
  margin-left: 1px;
  border: none;
  cursor: pointer;
  font-family: "Fredericka the Great", cursive;
  :hover {
    background-color: ${COLORS.highlight};
  }

  @media only screen and (min-width: 768px) {
    max-width: 100px;
    padding: 2px;
  }
`;

export default EditProfile;
