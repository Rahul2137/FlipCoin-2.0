import { Box } from "@mui/material";
import React from "react";
import "./wallet.css";

const WalletHistory = () => {
  return (
    <Box sx={{ width: "70%", background: "radial-gradient(circle at 6.6% 12%, rgb(64, 0, 126) 20.8%, rgb(0, 255, 160) 100.2%)" }}>
      <table style={{ width: "100%", padding: "2px" }}>
        <tr style={{height: "40px",fontFamily: "Inter,sans-serif", background: "linear-gradient(109.6deg, rgb(223, 234, 247) 11.2%, rgb(244, 248, 252) 91.1%)"}}>
          <th>Incoming</th>
          <th>Outgoing</th>
        </tr>
        <tr>
          <td align="center" className="blinking-icon-right">First Purchase</td>
          <td></td>
        </tr>
        <tr>
          <td></td>
          <td align="center" className="blinking-icon-left">Second Purchase</td>
        </tr>
      </table>
    </Box>
  );
};

export default WalletHistory;
