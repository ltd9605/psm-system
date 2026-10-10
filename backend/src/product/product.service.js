import * as productRepository
    from "./product.repository.js";

export async function getProducts(filters) {

    const {
        search,
        minPrice,
        maxPrice,
        brandId,
        limit = 10,
        offset = 0
    } = filters;

    const parsedLimit = Number(limit);
    const parsedOffset = Number(offset);

    if (
        !Number.isSafeInteger(parsedLimit) ||
        parsedLimit < 1 ||
        parsedLimit > 100
    ) {
        throw new Error("limit must be an integer between 1 and 100");
    }

    if (!Number.isSafeInteger(parsedOffset) || parsedOffset < 0) {
        throw new Error("offset must be a non-negative integer");
    }

    if (
        minPrice &&
        maxPrice &&
        Number(minPrice) > Number(maxPrice)
    ) {
        throw new Error(
            "minPrice must be less than maxPrice"
        );
    }

    const products = await productRepository.findProducts({
        search,
        minPrice,
        maxPrice,
        brandId,
        limit: parsedLimit,
        offset: parsedOffset
    });

    return {
        products,
        pagination: {
            limit: parsedLimit,
            offset: parsedOffset
        }
    };
}
export async function createProduct(data) {
    const {
        brandId,
        name,
        storage,
        color,
        description,
        price,
        quantity,
        imageUrl
    } = data;

    // Validate required fields
    if (!brandId) {
        throw new Error("Brand is required");
    }

    if (!name || !name.trim()) {
        throw new Error("Product name is required");
    }

    if (
        price === undefined ||
        Number(price) < 0
    ) {
        throw new Error("Invalid price");
    }

    if (
        quantity === undefined ||
        !Number.isInteger(Number(quantity)) ||
        Number(quantity) < 0
    ) {
        throw new Error("Invalid quantity");
    }

    // Check brand exists
    const brand =
        await productRepository.findBrandById(
            Number(brandId)
        );

    if (!brand) {
        throw new Error("Brand not found");
    }

    const productId =
        await productRepository.createProduct({
            brandId: Number(brandId),
            name: name.trim(),
            storage,
            color,
            description,
            price: Number(price),
            quantity: Number(quantity),
            imageUrl,
            status: "ACTIVE"
        });

    return await productRepository.findProductById(
        productId
    );
}
export async function updateProduct(id, data) {

    if (!Number.isInteger(id) || id <= 0) {
        throw new Error("Invalid product id");
    }

    const existingProduct =
        await productRepository.findProductById(id);

    if (!existingProduct) {
        throw new Error("Product not found");
    }

    const {
        brandId,
        name,
        storage,
        color,
        description,
        price,
        quantity,
        imageUrl,
        status
    } = data;

    if (!name) {
        throw new Error("Product name is required");
    }

    if (price === undefined || Number(price) < 0) {
        throw new Error("Invalid price");
    }

    if (
        quantity === undefined ||
        Number(quantity) < 0
    ) {
        throw new Error("Invalid quantity");
    }

    await productRepository.updateProduct(id, {
        brandId,
        name,
        storage,
        color,
        description,
        price: Number(price),
        quantity: Number(quantity),
        imageUrl,
        status
    });

    return await productRepository.findProductById(id);
}
export async function deleteProduct(id) {

    if (!Number.isInteger(id) || id <= 0) {
        throw new Error("Invalid product id");
    }

    const product =
        await productRepository.findProductById(id);

    if (!product) {
        throw new Error("Product not found");
    }

    if (product.status === "INACTIVE") {
        throw new Error("Product already deleted");
    }

    await productRepository.softDeleteProduct(id);
}

export async function checkProductQuantity(id, requestedQuantity) {
    if (!Number.isInteger(id) || id <= 0) {
        throw new Error("Invalid product id");
    }

    const product = await productRepository.getProductQuantity(id);
    if (!product) {
        throw new Error("Product not found");
    }

    return {
        productId: id,
        availableQuantity: product.quantity,
        isSufficient: requestedQuantity !== undefined ? product.quantity >= requestedQuantity : true
    };
}
