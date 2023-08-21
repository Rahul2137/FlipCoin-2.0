import { Box } from "@mui/material";
import React from "react";
import "./wallet.css";

const WalletHistory = ({ data }) => {
  return (
    <Box
      sx={{
        width: "100%",
        background:
          "radial-gradient(circle at 6.6% 12%, rgb(64, 0, 126) 20.8%, rgb(0, 255, 160) 100.2%)",
      }}
    >
      <table style={{ width: "100%", padding: "2px" }}>
        <tr
          style={{
            height: "40px",
            fontFamily: "Inter,sans-serif",
            background:
              "linear-gradient(109.6deg, rgb(223, 234, 247) 11.2%, rgb(244, 248, 252) 91.1%)",
          }}
        >
          <th>Incoming</th>
          <th>Outgoing</th>
        </tr>
        {data.map((item, i) => {
          if (item.transaction === 0) {
            return (
              <tr>
                <td></td>
                <td
                  align="center"
                  className="blinking-icon-left"
                  style={{ backgroundColor: "#a32505" }}
                >
                  On <b style={{ color: "#7fb8b5" }}>{item.timestamp}</b>{" "}
                  recieved <b style={{ color: "#7fb8b5" }}>{item.amount}</b>{" "}
                  from <b style={{ color: "#7fb8b5" }}>{item.otherParty}</b>{" "}
                </td>
              </tr>
            );
          } else {
            return (
              <tr>
                <td
                  align="center"
                  className="blinking-icon-right"
                  style={{ backgroundColor: "#0b700b" }}
                >
                  On <b style={{ color: "#43deb0" }}>{item.timestamp}</b>{" "}
                  recieved <b style={{ color: "#43deb0" }}>{item.amount}</b>{" "}
                  from <b style={{ color: "#43deb0" }}>{item.otherParty}</b>{" "}
                </td>
                <td></td>
              </tr>
            );
          }
        })}
      </table>
    </Box>
  );
};

export default WalletHistory;
