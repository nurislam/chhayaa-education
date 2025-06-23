import { ProductType } from "@/types/products";
import Base from "./base";

class Product extends Base<ProductType, ProductType> {}

export default new Product();
