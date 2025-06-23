import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Slider,
  Typography,
  Checkbox,
  FormControlLabel,
  TextField,
  List,
  ListItem,
} from "@mui/material";
import { useState } from "react";

const categories = ["Electronics", "Fashion", "Home", "Sports"];
const brands = ["Apple", "Samsung", "Nike", "Adidas"];
const locations = [
  "Dhaka",
  "Chattogram",
  "Khulna",
  "Rajshahi",
  "Sylhet",
  "Barishal",
  "Rangpur",
  "Mymensingh",
];
const attributes = ["Waterproof", "Wireless", "4K Display", "Bluetooth"];

export default function ProductFilters() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState<number[]>([0, 1000]);
  const [rating, setRating] = useState<any>("");
  const [inStock, setInStock] = useState(false);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [selectedAttributes, setSelectedAttributes] = useState<string[]>([]);

  // Handle checkbox selection for brands
  const handleBrandChange = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  // Handle checkbox selection for locations
  const handleLocationChange = (location: string) => {
    setSelectedLocations((prev) =>
      prev.includes(location)
        ? prev.filter((l) => l !== location)
        : [...prev, location]
    );
  };

  // Handle checkbox selection for attributes
  const handleAttributeChange = (attribute: string) => {
    setSelectedAttributes((prev) =>
      prev.includes(attribute)
        ? prev.filter((attr) => attr !== attribute)
        : [...prev, attribute]
    );
  };

  return (
    <Box p={2} sx={{ backgroundColor: "#f9f9f9", borderRadius: "8px" }}>
      <Typography variant="h6">Filters</Typography>

      {/* 🔹 Price Range Filter */}
      <Typography sx={{ mt: 2 }}>Price Range ($)</Typography>
      <Slider
        value={price}
        onChange={(e, newValue) => setPrice(newValue as number[])}
        valueLabelDisplay="auto"
        min={0}
        max={1000}
      />
      {/* 🔹 Availability Filter */}
      <FormControlLabel
        control={
          <Checkbox
            checked={inStock}
            onChange={(e) => setInStock(e.target.checked)}
          />
        }
        label="In Stock Only"
        sx={{ mt: 2 }}
      />
      {/* 🔹 Search by Name */}
      <TextField
        fullWidth
        size="small"
        label="Search Product"
        variant="outlined"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        sx={{ mt: 2 }}
      />
        {/* 🔹 Rating Filter */}
      <FormControl fullWidth size="small" sx={{ mt: 2 }}>
      <InputLabel>Any Rating</InputLabel>
        <Select
          value={rating}
          onChange={(e) =>setRating(Number(e.target.value))}
          displayEmpty
        >
          <MenuItem value="">Any Rating</MenuItem>
          {[5, 4, 3, 2, 1].map((star) => (
          <MenuItem key={star} value={star}>
            {"⭐".repeat(star)}
          </MenuItem>
        ))}
        </Select>
      </FormControl>
      
      {/* 🔹 Category Filter */}
      <FormControl fullWidth size="small" sx={{ mt: 2 }}>
        <Select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          displayEmpty
        >
          <MenuItem value="">All Categories</MenuItem>
          {categories.map((cat) => (
            <MenuItem key={cat} value={cat}>
              {cat}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      

      
 

      {/* 🔹 Brand Filter (Checkbox) */}
      <Typography sx={{ mt: 2 }}>Brand</Typography>
      <List
        dense
        sx={{
          maxHeight: 150,
          overflowY: "auto",
          backgroundColor: "#fff",
          p: 1,
          borderRadius: "5px",
        }}
      >
        {brands.map((brand) => (
          <ListItem key={brand} disableGutters>
            <FormControlLabel
              control={
                <Checkbox
                  checked={selectedBrands.includes(brand)}
                  onChange={() => handleBrandChange(brand)}
                />
              }
              label={brand}
            />
          </ListItem>
        ))}
      </List>

      {/* 🔹 Location Filter (Checkbox) */}
      <Typography sx={{ mt: 2 }}>Location</Typography>
      <List
        dense
        sx={{
          maxHeight: 150,
          overflowY: "auto",
          backgroundColor: "#fff",
          p: 1,
          borderRadius: "5px",
        }}
      >
        {locations.map((location) => (
          <ListItem key={location} disableGutters>
            <FormControlLabel
              control={
                <Checkbox
                  checked={selectedLocations.includes(location)}
                  onChange={() => handleLocationChange(location)}
                />
              }
              label={location}
            />
          </ListItem>
        ))}
      </List>

      {/* 🔹 Attributes Filter (Checkbox) */}
      <Typography sx={{ mt: 2 }}>Attributes</Typography>
      <List
        dense
        sx={{
          maxHeight: 150,
          overflowY: "auto",
          backgroundColor: "#fff",
          p: 1,
          borderRadius: "5px",
        }}
      >
        {attributes.map((attribute) => (
          <ListItem key={attribute} disableGutters>
            <FormControlLabel
              control={
                <Checkbox
                  checked={selectedAttributes.includes(attribute)}
                  onChange={() => handleAttributeChange(attribute)}
                />
              }
              label={attribute}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
}
