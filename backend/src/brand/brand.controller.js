import * as brandService from "./brand.service.js";

export async function getBrands(req, res) {
    try {
        const brands = await brandService.getBrands(req.query);
        res.status(200).json(brands);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export async function getBrandById(req, res) {
    try {
        const brand = await brandService.getBrandById(req.params.id);
        res.status(200).json(brand);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
}

export async function createBrand(req, res) {
    try {
        const brand = await brandService.createBrand(req.body);
        res.status(201).json(brand);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

export async function updateBrand(req, res) {
    try {
        const brand = await brandService.updateBrand(req.params.id, req.body);
        res.status(200).json(brand);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

export async function deleteBrand(req, res) {
    try {
        const result = await brandService.deleteBrand(req.params.id);
        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}
