const initialState = {
  status: "loading",
  orders: [],
};

export default function ordersReducer(state = initialState, action) {
  switch (action.type) {
    // ADMIN ACTIONS
    case "REQUEST_ADMIN_ORDERS": {
      return {
        ...state,
        status: "loading",
      };
    }
    case "RECEIVED_ADMIN_ORDERS": {
      return {
        ...state,
        status: "success",
        orders: [...action.data],
      };
    }
    case "REQUEST_ADMIN_ORDERS_ERROR": {
      return {
        ...state,
        status: "error",
        error: action.error,
      };
    }

    // ADMIN EDIT ORDER STATUS
    case "EDIT_ORDER_SUCCESS": {
      return {
        ...state,
        status: "success",
        orders: state.orders.map((order) =>
          order._id !== action.payload.orderId
            ? order
            : {
                ...order,
                status: action.payload.orderStatus,
                isArchived: action.payload.isArchived,
              }
        ),
      };
    }
    case "EDIT_ORDER_ERROR": {
      return {
        ...state,
        status: "error",
        error: action.error,
      };
    }

    // ADMIN DELETE ORDER
    case "DELETE_ORDER_SUCCESS": {
      return {
        ...state,
        orders: state.orders.filter(
          (order) => order._id !== action.payload.orderId
        ),
      };
    }
    case "DELETE_ORDER_ERROR": {
      return {
        ...state,
        status: "error",
        error: action.payload.error,
      };
    }

    // USER ACTIONS
    case "REQUEST_USER_ORDERS": {
      return {
        ...state,
        status: "loading",
      };
    }
    case "RECEIVED_USER_ORDERS": {
      return {
        ...state,
        status: "success",
        orders: action.payload.data,
      };
    }
    case "REQUEST_USER_ORDERS_ERROR": {
      return {
        ...state,
        status: "error",
        orders: [],
        error: action.payload.error,
      };
    }
    case "CLEANUP_ORDERS": {
      return {
        status: "loading",
        orders: [],
      };
    }
    default: {
      return state;
    }
  }
}
