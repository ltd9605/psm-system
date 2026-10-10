import * as brandService from "./brand.service.js";

export async function getBrands(req, res) {
  const brands = await brandService.getBrands(req.query);
  res.status(200).json(brands);
}

export async function getBrandById(req, res) {
  const brand = await brandService.getBrandById(req.params.id);
  res.status(200).json(brand);
}

export async function createBrand(req, res) {
  const brand = await brandService.createBrand(req.body);
  res.status(201).json(brand);
}

export async function updateBrand(req, res) {
  const brand = await brandService.updateBrand(req.params.id, req.body);
  res.status(200).json(brand);
}

export async function deleteBrand(req, res) {
  const result = await brandService.deleteBrand(req.params.id);
  res.status(200).json(result);
}
