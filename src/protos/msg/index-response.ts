const INDEX_RESPONSE_SYMBOL = Symbol('IndexResponse');

export interface IndexResponseObject {
  [INDEX_RESPONSE_SYMBOL]: true;
  index: number;
}

export const IndexResponse = (index: number): IndexResponseObject => ({
  [INDEX_RESPONSE_SYMBOL]: true,
  index,
});

export const isIndexResponse = (obj: any): obj is IndexResponseObject => {
  return obj != null && obj[INDEX_RESPONSE_SYMBOL] === true;
};
