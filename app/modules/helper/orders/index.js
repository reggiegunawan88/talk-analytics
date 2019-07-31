export function countSubTotal(orderProducts) {
  let res = 0;
  orderProducts.forEach(orderProduct => {
    if (orderProduct.productSku) {
      res += orderProduct.quantity * orderProduct.productSku.price;
    } else {
      res += orderProduct.quantity * orderProduct.product.price;
    }
  });
  return res;
}

export function simplifyVariant(variant) {
  let res = '';
  const splittedVariant = variant.split('||');

  splittedVariant.forEach((v, i) => {
    const nameValue = v.split('=');
    res += `${nameValue[0]}: ${nameValue[1]}`;
    if (i !== splittedVariant.length - 1) res += ', ';
  });

  return res;
}
