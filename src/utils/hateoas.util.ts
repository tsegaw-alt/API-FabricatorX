interface Link {
    rel: string;
    method: string;
    href: string;
  }
  
  interface QueryParams {
    [key: string]: string | number | boolean;
  }
  
  function queryParamsToString(queryParams: QueryParams): string {
    const queryString = Object.entries(queryParams)
      .map(
        ([key, value]) =>
          `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
      )
      .join("&");
    return queryString ? "?" + queryString : "";
  }
  
  export function addLinks<T extends Record<string, any>>(
    data: T,
    methods: string[],
    route: (data: T) => string,
    queryParams?: QueryParams
  ): T & { links: Link[] } {
    const basePath = process.env.BASE_PATH || 'http://localhost:3000/api';
    const version = process.env.API_VERSION || 'v1';
  
    const links: Link[] = methods.map((method) => ({
      rel: method.toLowerCase(),
      method,
      href: `${basePath}/${version}${route(data)}${
        queryParams ? queryParamsToString(queryParams) : ""
      }`,
    }));
  
    return { ...data, links };
  }
  
  export function addLinksToList<T extends Record<string, any>>(
    dataList: T[],
    methods: string[],
    route: (data: T) => string,
    queryParams?: QueryParams
  ): (T & { links: Link[] })[] {
    return dataList.map((data) => addLinks(data, methods, route, queryParams));
  }
  