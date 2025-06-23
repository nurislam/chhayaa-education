import { useState } from "react";
import { Box, Tabs, Tab, Typography } from "@mui/material";
import Reviews from "./reviews";

interface Props {
  product: { description: string };
}

export default function TabsSection({ product }: Props) {
  const [tabIndex, setTabIndex] = useState(0);

  return (
    <Box sx={{ mt: 3 }}>
      <Tabs value={tabIndex} onChange={(e, index) => setTabIndex(index)}>
        <Tab label="Description" />
        <Tab label="Reviews" />
      </Tabs>

      <Box sx={{ mt: 2 }}>
        {tabIndex === 0 && <Typography>{product.description}</Typography>}
        {tabIndex === 1 && <Reviews />}
      </Box>
    </Box>
  );
}
