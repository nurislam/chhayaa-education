import { useState } from "react";
import { Box, Card, CardMedia } from "@mui/material";

interface Props {
  images: string[];
}

export default function ProductGallery({ images }: Props) {
  const [selectedImage, setSelectedImage] = useState(images[0]);

  return (
    <Box>
      <Card>
        <CardMedia component="img" height="300" image={selectedImage} alt="Product Image" />
      </Card>
      <Box display="flex" gap={1} mt={2}>
        {images.map((img, index) => (
          <Card key={index} sx={{ cursor: "pointer", width: 60, height: 60 }}>
            <CardMedia
              component="img"
              image={img}
              sx={{ width: "100%", height: "100%" }}
              onClick={() => setSelectedImage(img)}
            />
          </Card>
        ))}
      </Box>
    </Box>
  );
}
