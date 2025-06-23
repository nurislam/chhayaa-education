import { Box, Typography } from "@mui/material";

interface Category {
  id: number;
  categoryName: string;
}
interface Company {
  id: number;
  name: string;
}
interface Props {
  product: {
    name: string;
    price: number;
    company: Company;
    category: Category;
    attributes: { key: string; value: string }[];
  };
}

export default function ProductInfo({ product }: Props) {
  return (
    <Box>
      <Typography variant="h4">{product.name}</Typography>

      <Typography variant="body1" sx={{ mt: 1 }}>
        Category: {product.category?.categoryName}
      </Typography>
      <Typography variant="body1" sx={{ mt: 1 }}>
        Company: {product.company?.name}
      </Typography>
      <Typography variant="h5" color="primary" sx={{ mt: 1 }}>
        ${product.price}
      </Typography>
      <Box mt={2}>
        {/* {product.attributes.map((attr, index) => (
          <Typography key={index} variant="body2">
            {attr.key}: {attr.value}
          </Typography>
        ))} */}
      </Box>
    </Box>
  );
}
