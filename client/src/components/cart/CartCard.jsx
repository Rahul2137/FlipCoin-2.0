import { Button, Box } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import { getMainActions } from "../../app/actions/mainActions";
import { connect } from "react-redux";

const CartCard = ({ item, changeCount, removeItem, addToCart }) => {
  const incItem = async () => {
    const data = {
      productId: item.productId,
      op: 1,
    };
    const res = await addToCart(data);
    if (!res?.error) {
      changeCount(item.productId, "increase");
    }
  };
  const decItem = async () => {
    const data = {
      productId: item.productId,
      op: -1,
    };
    const res = await addToCart(data);
    if (!res?.error) {
      changeCount(item.productId, "decrease");
    }
  };
  const deleteItem = async () => {
    const data = {
      productId: item.productId,
      op: 0,
    };
    const res = await addToCart(data);
    if (!res?.error) {
      removeItem(item.id);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        fontFamily: "Arial, Helvetica, sans-serif",
        paddingBottom: "20px",
      }}
    >
      <div style={{ flex: "1" }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <h3>{item.name}</h3>
          <div style={{ margin: "15px 5px 0px 0px" }}>
            <IconButton onClick={deleteItem} aria-label="delete">
              <DeleteIcon />
            </IconButton>
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <p>Price: Rs.{item?.price}</p>
          <p>Total: Rs. {item?.price * item?.productQt}</p>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <p style={{ margin: "0 0 20px 0" }}>
            Tokens:{" "}
            {Math.min(
              Math.floor((item.price / 100) * item.offerRate),
              item.offerCap
            )}
          </p>
          <p style={{ margin: "0 0 20px 0" }}>
            Total Tokens:
            {Math.min(
              Math.floor((item.price / 100) * item.offerRate * item.productQt),
              item.offerCap
            )}
          </p>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <Button
            size="large"
            disableElevation
            variant="contained"
            onClick={decItem}
          >
            -
          </Button>
          <p>{item.productQt}</p>
          <Button
            size="large"
            disableElevation
            variant="contained"
            onClick={incItem}
          >
            +
          </Button>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontFamily: "Arial, Helvetica, sans-serif",
          }}
        >
          <p>Max earnable tokens: {item?.offerCap}</p>
          <p>One token maps to Rs.{item?.receiveRate}</p>
        </div>
      </div>
      <img
        src={item.imgUrl}
        style={{ width: "200px", height: "205px", margin: "30px 0 10px 10px" }}
        alt="Hello"
      />
    </Box>
  );
};

const mapActionsToProps = (dispatch) => {
  return {
    ...getMainActions(dispatch),
  };
};
export default connect(null, mapActionsToProps)(CartCard);
