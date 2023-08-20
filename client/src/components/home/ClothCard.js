import * as React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import Typography from "@mui/material/Typography";
import { Box, Switch, styled, IconButton } from "@mui/material";
import { connect, useSelector } from "react-redux";
import { getMainActions } from "../../app/actions/mainActions";
const ClothCard = ({ item, addToCart }) => {
  const userInfo = useSelector((state) => state.user);
  const label = { inputProps: { "aria-label": "Switch demo" } };
  const useStyles = styled({
    root: {
      maxWidth: 310,
      transition: "transform 0.15s ease-in-out",
    },
    cardHovered: {
      transform: "scale3d(1.05, 1.05, 1)",
    },
  });
  const classes = useStyles();
  const [state, setState] = React.useState({
    raised: false,
    shadow: 1,
  });

  const handleAddToCart = () => {
    const data = {
      productId: item._id,
      op: 1,
    };
    addToCart(data);
  };

  return (
    <Card
      sx={{ margin: 2, width: 270 }}
      classes={{ root: state.raised ? classes.cardHovered : "" }}
      onMouseOver={() => setState({ raised: true, shadow: 3 })}
      onMouseOut={() => setState({ raised: false, shadow: 1 })}
      raised={state.raised}
      zdepth={state.shadow}
    >
      <Box position="relative">
        <CardMedia
          component="img"
          alt="green iguana"
          height="260"
          image={item.imgUrl}
        />
        <IconButton
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            backgroundColor: "90% transparent",
            display:
              userInfo &&
              userInfo.userDetails &&
              userInfo.userDetails.role !== "seller"
                ? "none"
                : "block",
          }}
        >
          <CloseIcon sx={{ color: "black" }} />
        </IconButton>
        <IconButton
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            backgroundColor: "80% transparent",
            display:
              userInfo &&
              userInfo.userDetails &&
              userInfo.userDetails.role !== "seller"
                ? "none"
                : "block",
          }}
        >
          <EditIcon sx={{ color: "black" }} />
        </IconButton>
        <CardContent style={{ margin: "0 15px", padding: "0" }}>
          <table style={{ width: "100%", margin: "auto 5px" }}>
            <tr>
              <td>
                <Typography variant="h5">{item.name}</Typography>
              </td>
              <td align="right">
                <Typography variant="h6">Rs. {item.price}</Typography>
              </td>
            </tr>
          </table>
        </CardContent>
        <CardActions style={{ justifyContent: "center" }}>
          <Button
            style={{
              display:
                userInfo &&
                userInfo.userDetails &&
                userInfo.userDetails.role === "seller"
                  ? "none"
                  : "block",
            }}
            size="medium"
            variant="text"
            onClick={handleAddToCart}
          >
            Add to Cart
          </Button>
          {/* <div
            style={{
              display:
                userInfo &&
                userInfo.userDetails &&
                userInfo.userDetails.role !== "seller"
                  ? "none"
                  : "flex",
            }}
          >
            <Typography>Avail Loyalty Program </Typography>
            <Switch {...label} />
          </div> */}
        </CardActions>
      </Box>
    </Card>
  );
};

const mapActionsToProps = (dispatch) => {
  return {
    ...getMainActions(dispatch),
  };
};
export default connect(null, mapActionsToProps)(ClothCard);
