import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { useToasts } from "react-toast-notifications";
import styled from "styled-components";
import * as actions from "../../redux/actions";
import { COLORS } from "../../contants";
import Loading from "../Loading";

const Menu = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const menuItems = useSelector((state) => state.items.items);
  const loadingStatus = useSelector((state) => state.items.status);
  const { addToast } = useToasts();

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

  const handleClick = (e, itemId) => {
    dispatch(actions.redirectAfterLogin(`/items/${itemId}`));
    history.push(`/items/${itemId}`);
  };

  const handleKeyPress = (e, itemId) => {
    if (e.code === "Enter") {
      dispatch(actions.redirectAfterLogin(`/items/${itemId}`));
      history.push(`/items/${itemId}`);
    }
  };

  const handleAddToCart = (
    e,
    _id,
    itemName,
    description,
    category,
    price,
    image
  ) => {
    e.stopPropagation();
    dispatch(
      actions.addItem({
        _id,
        itemName,
        description,
        category,
        price,
        image,
      })
    );
    addToast(`${itemName} was added to your cart`, {
      appearance: "success",
      autoDismiss: true,
    });
  };

  return (
    <Wrapper>
      {loadingStatus === "loading" && <Loading />}
      {loadingStatus === "error" && <p>An error occurred...</p>}
      {loadingStatus === "success" && (
        <>
          {menuItems.length === 0 ? (
            <p>No item found.</p>
          ) : (
            menuItems.map((item) => {
              const {
                _id,
                itemName,
                description,
                category,
                price,
                image,
              } = item;
              const formattedPrice = new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
              }).format(item.price / 100);
              return (
                <ItemBox
                  key={item._id}
                  tabIndex="0"
                  onClick={(e) => handleClick(e, item._id)}
                  onKeyDown={(e) => handleKeyPress(e, item._id)}
                  aria-label="View item details"
                  role="button"
                >
                  <ItemImageBox>
                    {item.image && (
                      <ItemImage src={item.image} alt={item.itemName} />
                    )}
                  </ItemImageBox>
                  <ItemInfoDiv>
                    <ItemTextBox>
                      <ItemTitle>{item.itemName}</ItemTitle>
                      <ItemDesc>{item.description}</ItemDesc>
                    </ItemTextBox>
                    <ItemCat>Category: {item.category}</ItemCat>
                    <PriceDiv>
                      <Price>{formattedPrice}</Price>
                      <Btn
                        onClick={(e) => {
                          handleAddToCart(
                            e,
                            _id,
                            itemName,
                            description,
                            category,
                            price,
                            image
                          );
                        }}
                      >
                        Add to cart
                      </Btn>
                    </PriceDiv>
                  </ItemInfoDiv>
                </ItemBox>
              );
            })
          )}
        </>
      )}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-evenly;
  align-items: flex-start;
  padding: 10px;
  font-family: "Roboto Condensed", sans-serif;
  color: ${COLORS.darkest};

  @media only screen and (min-width: 768px) {
    justify-content: space-around;
    min-height: initial;
  }

  @media only screen and (min-width: 992px) {
    justify-content: space-between;
    width: 1000px;
  }
`;

const ItemBox = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 10px;
  border: 1px double ${COLORS.lightBorders};
  padding: 10px;
  box-shadow: inset 0 0 50px #bfa984;
  background-color: #f7f0e4;

  :hover {
    cursor: pointer;
    background-color: ${COLORS.lightBackground};
  }

  @media only screen and (min-width: 768px) {
    width: 45%;
  }

  @media only screen and (min-width: 992px) {
    width: 300px;
    flex-direction: column;
  }
`;

const ItemImageBox = styled.div`
  width: 100px;
  & > img {
    border: 2px solid ${COLORS.lightBackground};
    box-shadow: 3px 4px 5px 0px rgba(0, 0, 0, 0.38);
  }

  @media only screen and (min-width: 768px) and (max-width: 992px) {
    /* tablet */
    width: 150px;
  }

  @media only screen and (min-width: 992px) {
    /* desktop */
    width: initial;
    text-align: center;
  }
`;

const ItemInfoDiv = styled.div`
  padding-left: 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;

  @media only screen and (min-width: 992px) {
    /* desktop */
    padding-left: initial;
    padding-top: 10px;
    height: 120px;
  }
`;

const ItemTextBox = styled.div``;

const ItemTitle = styled.h4`
  font-weight: bold;
  font-size: 1rem;
  margin-bottom: 4px;
  font-family: "Fredericka the Great", cursive;
  color: ${COLORS.highlight2};
`;

const ItemDesc = styled.h4`
  font-size: 1rem;
  margin-bottom: 4px;
`;

const ItemCat = styled.h4`
  font-size: 1rem;
  margin-bottom: 4px;
  height: 50px;
  display: none;
`;

const ItemImage = styled.img`
  width: 100px;
  height: 100px;
  overflow: hidden;
  object-fit: cover;
  margin-bottom: 0px;

  @media only screen and (min-width: 768px) and (max-width: 992px) {
    /* tablet */
    width: 150px;
    height: 150px;
  }

  @media only screen and (min-width: 992px) {
    /* desktop */
    width: 294px;
    height: 294px;
  }
`;

const PriceDiv = styled.div`
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
  align-items: center;
`;

const Price = styled.p`
  font-size: 1.5rem;
  font-weight: bold;
  color: ${COLORS.darkest};
  font-family: "Fredericka the Great", cursive;
`;

const Btn = styled.button`
  position: relative;
  display: block;
  width: 50%;
  background: ${COLORS.primary};
  color: #fff;
  border: none;
  padding: 8px;
  margin-top: 0px;
  cursor: pointer;
  font-family: "Fredericka the Great", cursive;

  :hover {
    background-color: ${COLORS.highlight};
  }
  @media only screen and (min-width: 992px) {
    /* desktop */
    padding: 2px;
  }
`;

export default Menu;
