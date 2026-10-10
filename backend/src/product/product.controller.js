import * as productService from "./product.service.js"

export async function getProducts(req, res) {
    try {
        const filters = {
            search: req.query.search,
            minPrice: req.query.minPrice,
            maxPrice: req.query.maxPrice,
            brandId: req.query.brandId,
            limit: req.query.limit,
            offset: req.query.offset
        };

        const result =
            await productService.getProducts(filters);

        return res.status(200).json({
            message: "Get products successfully",
            data: result.products,
            pagination: result.pagination
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
}
export async function createProduct(req, res) {
    try {
        const product =
            await productService.createProduct(req.body);

        return res.status(201).json({
            message: "Create product successfully",
            data: product
        });

    } catch (error) {
        return res.status(400).json({
            message: error.message
        });
    }
}
export async function updateProduct(req, res) {
    try {
        const productId = Number(req.params.id);

        const updatedProduct =
            await productService.updateProduct(
                productId,
                req.body
            );

        return res.status(200).json({
            message: "Update product successfully",
            data: updatedProduct
        });

    } catch (error) {
        return res.status(400).json({
            message: error.message
        });
    }
}
export async function deleteProduct(req, res) {
    try {
        const productId = Number(req.params.id);

        await productService.deleteProduct(productId);

        return res.status(200).json({
            message: "Delete product successfully"
        });

    } catch (error) {
        return res.status(400).json({
            message: error.message
        });
    }
}

export async function checkProductQuantity(req, res) {
    try {
        const productId = Number(req.params.id);
        const requestedQuantity = req.query.quantity ? Number(req.query.quantity) : undefined;

        if (req.query.quantity && (isNaN(requestedQuantity) || requestedQuantity < 0)) {
            return res.status(400).json({ message: "Invalid quantity requested" });
        }

        const result = await productService.checkProductQuantity(productId, requestedQuantity);

        return res.status(200).json({
            message: "Check product quantity successfully",
            data: result
        });

    } catch (error) {
        return res.status(400).json({
            message: error.message
        });
    }
}