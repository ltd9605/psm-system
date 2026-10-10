import { AppError } from "../utils/AppError.js";
import * as brandRepo from "./brand.repository.js";

export async function getBrands(filters) {
  return await brandRepo.findBrands(filters);
}

export async function getBrandById(id) {
  const brand = await brandRepo.findBrandById(id);
  if (!brand) throw new AppError("Brand not found", 404);
  return brand;
}

export async function createBrand(data) {
  if (!data.name) throw new AppError("Brand name is required", 400);
  const newId = await brandRepo.createBrand(data);
  return await getBrandById(newId);
}

export async function updateBrand(id, data) {
  const affectedRows = await brandRepo.updateBrand(id, data);
  if (affectedRows === 0)
    throw new AppError("Brand not found or no changes made", 404);
  return await getBrandById(id);
}

export async function deleteBrand(id) {
  try {
    const affectedRows = await brandRepo.deleteBrand(id);
    if (affectedRows === 0) throw new AppError("Brand not found", 404);
    return { message: "Brand deleted successfully" };
  } catch (error) {
    // Handle foreign key constraint error if products exist for this brand
    if (error.code === "ER_ROW_IS_REFERENCED_2") {
      throw new AppError(
        "Cannot delete brand because it is currently linked to one or more products",
        400,
      );
    }
    throw error;
  }
}
