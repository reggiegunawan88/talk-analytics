const normalizeVariants = variants => {
  const normalized = [];

  variants.forEach(variant => {
    normalized.push({
      id: variant.id,
      name: variant.name,
      options: variant.options,
      visible: true,
      variation: true
    });
  });

  return normalized;
};

const normalizeVariantValues = (variantValues, weightProduct) => {
  const normalized = [];

  variantValues.forEach(variantValue => {
    const {
      id,
      regular_price,
      attributes,
      weight,
      sku,
      manage_stock,
      stock_quantity
    } = variantValue;
    const values = [];

    attributes.forEach(v => {
      values.push({ id: v.id, name: v.name, option: v.option });
    });

    normalized.push({
      id,
      regular_price,
      values,
      weight: weight || weightProduct,
      unlimited: !manage_stock,
      stock_quantity: stock_quantity,
      sku: sku
    });
  });

  return normalized;
};

export const normalizeProductStructure = (product, listVariant) => {
  const {
    id,
    name,
    description,
    manage_stock,
    sku,
    price,
    type,
    regular_price,
    stock_quantity,
    weight,
    categories,
    attributes
  } = product;

  const variantValues = normalizeVariantValues(listVariant, weight);
  const variants = normalizeVariants(attributes);

  return {
    id,
    name,
    type,
    description,
    category: categories || [],
    code: sku,
    price: regular_price,
    weight,
    stock: stock_quantity,
    unlimited: !manage_stock,
    haveVariant: attributes.length > 0,
    variants,
    variantValues
  };
};
