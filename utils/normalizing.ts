import { reject } from "lodash/fp";

export const convertArrayToObject = (array: any[] = [], key: string) => {
  if (!key) {
    return {};
  }
  const cleanArray = reject((item: any) => !item[key])(array);

  return Object.assign(
    {},
    ...cleanArray.map((item: any) => ({
      [item[key]]: item,
    }))
  );
};
