export function buildOrder({
                               id,
                               productName,
                               price,
                               quantity,
                               createdAt = new Date().toISOString(),
                           }) {
    return {
        id,
        productName,
        price: Number(price),
        quantity: Number(quantity),
        total: +(Number(price) * Number(quantity)).toFixed(2),
        createdAt,
    };
}
