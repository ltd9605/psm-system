import * as brandRepo from "./brand.repository.js";

export async function getBrands(filters) {
    return await brandRepo.findBrands(filters);
}

export async function getBrandById(id) {
    const brand = await brandRepo.findBrandById(id);
    if (!brand) throw new Error("Brand not found");
    return brand;
}

export async function createBrand(data) {
    if (!data.name) throw new Error("Brand name is required");
    const newId = await brandRepo.createBrand(data);
    return await getBrandById(newId);
}

export async function updateBrand(id, data) {
    const affectedRows = await brandRepo.updateBrand(id, data);
    if (affectedRows === 0) throw new Error("Brand not found or no changes made");
    return await getBrandById(id);
}

export async function deleteBrand(id) {
    try {
        const affectedRows = await brandRepo.deleteBrand(id);
        if (affectedRows === 0) throw new Error("Brand not found");
        return { message: "Brand deleted successfully" };
    } catch (error) {
        // Handle foreign key constraint error if products exist for this brand
        if (error.code === 'ER_ROW_IS_REFERENCED_2') {
            throw new Error("Cannot delete brand because it is currently linked to one or more products");
        }
        throw error;
    }
}
