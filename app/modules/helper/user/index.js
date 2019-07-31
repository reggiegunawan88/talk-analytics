export const getFirstName = fullname => fullname.split(' ')[0];

export const getLastName = fullname => {
  const parsedName = fullname.split(' ');
  return parsedName.length === 1
    ? ''
    : parsedName.splice(1, parsedName.length - 1).join(' ');
};
