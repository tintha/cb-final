import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { useToasts } from "react-toast-notifications";
import styled from "styled-components";
import * as actions from "../../redux/actions";
import { COLORS } from "../../contants";
import Loading from "../Loading";

const MenuItems = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const { addToast } = useToasts();
  const menuItems = useSelector((state) => state.items.items);
  const loadingStatus = useSelector((state) => state.items.status);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const response = await fetch("/api/items");
      const data = await response.json();
      dispatch(actions.receivedItems(data.data));
    } catch (err) {
      dispatch(actions.itemsError(err));
    }
  };

  const handleDeleteItem = async (e, itemId) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/items/${itemId}`, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (data.status === 200) {
        addToast("Item deleted", {
          appearance: "success",
          autoDismiss: true,
        });
        dispatch(actions.deleteItemSuccess(data.itemId));
      }
    } catch (err) {
      dispatch(actions.deleteItemError(err));
    }
  };

  return (
    <Wrapper>
      {loadingStatus === "loading" && <Loading />}
      {loadingStatus === "error" && <p>An error occurred...</p>}
      {loadingStatus === "success" && (
        <DisplayItemContainer>
          {menuItems === null || menuItems === undefined ? (
            <p>No item found.</p>
          ) : (
            menuItems.map((item) => {
              const formattedPrice = new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
              }).format(item.price / 100);
              return (
                <ItemBox key={item._id}>
                  <p>
                    <Bold>Item name</Bold>: {item.itemName}
                  </p>
                  <p>
                    <Bold>Description</Bold>: {item.description}
                  </p>
                  <p>
                    <Bold>Category</Bold>: {item.category}
                  </p>
                  <p>
                    <Bold>Price</Bold>: {formattedPrice}
                  </p>
                  <ImageDiv>
                    {item.image ? (
                      <img src={item.image} alt="" width="200" />
                    ) : (
                      "No image"
                    )}
                  </ImageDiv>
                  <Buttons>
                    <Button
                      aria-label="Edit this item"
                      onClick={() =>
                        history.push(`/admin/menu/items/edit/${item._id}`)
                      }
                    >
                      Edit
                    </Button>
                    <Button
                      aria-label="Delete this item"
                      onClick={(e) =>
                        window.confirm(
                          "This action cannot be undone! Are you sure you wish to delete this item?"
                        ) && handleDeleteItem(e, item._id)
                      }
                    >
                      Delete
                    </Button>
                  </Buttons>
                </ItemBox>
              );
            })
          )}
        </DisplayItemContainer>
      )}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: "Roboto Condensed", sans-serif;
  color: ${COLORS.darkest};
  width: 100%;
`;

const DisplayItemContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;

  @media only screen and (min-width: 992px) {
    /* desktop */
    justify-content: space-around;
  }
`;

const Buttons = styled.div`
  display: flex;
  justify-content: space-around;
`;

const Button = styled.button`
  width: 100%;
  background-color: ${COLORS.primary};
  color: #fff;
  padding: 14px 20px;
  margin-left: 1px;
  margin-right: 1px;
  border: none;
  cursor: pointer;
  font-family: "Fredericka the Great", cursive;
  :hover {
    background-color: ${COLORS.highlight};
  }

  @media only screen and (min-width: 992px) {
    padding: 2px;
    width: 100px;
  }
`;

const ItemBox = styled.div`
  border: 1px solid ${COLORS.lightBorders};
  background-color: ${COLORS.lightBackground};
  padding: 10px;
  margin-bottom: 20px;
  width: 100%;
  box-shadow: 3px 4px 5px 0px rgba(0, 0, 0, 0.38);
  @media only screen and (min-width: 768px) {
    /* tablet */
    width: 30%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
`;

const ImageDiv = styled.div`
  text-align: center;
`;

const Bold = styled.span`
  font-weight: bold;
`;

export default MenuItems;
