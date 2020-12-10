import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import styled from "styled-components";
import * as actions from "../../redux/actions";
import { COLORS } from "../../contants";
import Loading from "../Loading";
import { TiMediaPlayReverse } from "react-icons/ti";
import { MdNavigateBefore } from "react-icons/md";

const ItemDetails = () => {
  let { id } = useParams();
  const dispatch = useDispatch();
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(true);
  const [itemData, setItemData] = useState({});
  useEffect(() => {
    loadData();
    window.scrollTo(0, 0);
  }, [id]);

  const loadData = async () => {
    try {
      const response = await fetch(`/api/items/${id}`);
      const data = await response.json();
      setItemData({ ...data.data });
      setIsLoading(!isLoading);
    } catch (err) {
      console.log(err);
    }
  };

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
  };

  const handleUpdateItem = async (e, id) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/items/${id}`, {
        method: "PUT",
        body: JSON.stringify({}),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();

      if (data.status === 200) {
        history.push("/");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleClickBack = (e) => {
    history.push("/items/");
  };

  const handleKeyPressBack = (e) => {
    if (e.code === "Enter") {
      history.push("/items/");
    }
  };

  return (
    <Wrapper>
      <PageTitle>
        <span>
          <TiMediaPlayReverse
            size="36"
            tabIndex="0"
            onClick={(e) => handleClickBack(e)}
            onKeyDown={(e) => handleKeyPressBack(e)}
            aria-label="Go back"
            role="button"
            className="backArrow"
          />
        </span>
        Item details
      </PageTitle>
      {isLoading && (
        <LoadingCentered>
          <Loading />
        </LoadingCentered>
      )}
      {itemData.itemName && itemData.description && (
        <Content>
          <ContentImage>
            {itemData.image && (
              <img src={itemData.image} width="300px" height="auto" />
            )}
          </ContentImage>
          <ContentDetails>
            <ItemTitle>{itemData.itemName}</ItemTitle>
            <ItemdDesc>{itemData.description}</ItemdDesc>
            <ActionBar>
              <Button
                onClick={() =>
                  dispatch(
                    actions.addItem({
                      _id: itemData._id,
                      itemName: itemData.itemName,
                      description: itemData.description,
                      category: itemData.category,
                      price: itemData.price,
                      image: itemData.image,
                    })
                  )
                }
              >
                Add to cart
              </Button>
              <Button>Add to favorites</Button>
              <Button>Review</Button>
            </ActionBar>
          </ContentDetails>
        </Content>
      )}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  width: 100%;
  font-family: "Roboto Condensed", sans-serif;
  color: ${COLORS.darkest};
  @media only screen and (min-width: 992px) {
    /* desktop */
    width: 1000px;
    margin: auto;
  }
`;

const PageTitle = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  font-weight: bold;
  font-size: 1.5rem;
  padding-bottom: 10px;
  .backArrow {
    cursor: pointer;
    :hover {
      color: ${COLORS.highlight};
    }
    :focus {
      color: ${COLORS.highlight};
    }
  }
`;

const Content = styled.div`
  display: flex;
  padding: 10px;
  border: 1px solid ${COLORS.lightBorders};
`;

const ContentImage = styled.div`
  border: 1px solid ${COLORS.lightBorders};
`;

const ContentDetails = styled.div`
  width: 100%;
  margin-left: 20px;
  padding: 20px;
  background-color: ${COLORS.lightBackground};
`;

const LoadingCentered = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
`;

const ItemTitle = styled.div`
  font-weight: bold;
  font-size: 1.5rem;
  margin-bottom: 4px;
  font-family: "Fredericka the Great", cursive;
  color: ${COLORS.highlight2};
`;

const ItemdDesc = styled.div`
  margin-top: 10px;
  margin-bottom: 10px;
`;

const ActionBar = styled.div``;

const Input = styled.input`
  width: 100%;
  padding: 12px 20px;
  margin: 8px 0;
  display: inline-block;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
  font-size: 1rem;
  background-color: ${COLORS.inputBackground};
`;

const Textarea = styled.textarea`
  box-sizing: border-box;
  width: 100%;
  height: 100px;
  border-radius: 5px;
  border: 1px solid #ccc;
  outline: none;
  resize: none;
  overflow: hidden;
  font-size: 1rem;
  padding: 12px 20px;
  margin: 8px 0;
  background-color: ${COLORS.inputBackground};
`;

const Button = styled.button`
  width: 100%;
  background-color: ${COLORS.primary};
  color: ${COLORS.inputText};
  padding: 14px 20px;
  margin: 8px 0;
  border: none;
  cursor: pointer;
  :hover {
    background-color: ${COLORS.highlight};
  }
  :focus {
    background-color: ${COLORS.highlight};
  }
  @media only screen and (min-width: 992px) {
    /* desktop */
    padding: 2px;
    width: 100px;
    margin-right: 10px;
  }
`;

export default ItemDetails;