import React, { useState } from "react";
import ClothCard from "./ClothCard";
import { Box, Paper } from "@mui/material";

const OutfitCard = ({ outfitDetails }) => {
  console.log(outfitDetails);
  return (
    <Box>
      <Paper sx={{ display: "flex", m: 2 }}>
        {outfitDetails &&
          outfitDetails.map((cloth, i) => <ClothCard item={cloth} key={i} />)}
      </Paper>
    </Box>
  );
};

export default OutfitCard;
