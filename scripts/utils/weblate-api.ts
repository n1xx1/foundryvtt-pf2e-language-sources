export type WeblateApi = ReturnType<typeof createWeblateApi>;

export function createWeblateApi(weblateToken: string, weblateUrl: string) {
  return {
    getAll,
    getAllStream,
    get,
    patch,
    fetchRaw,
    post,
  };

  async function getAll<T = any>(url: string, query: any): Promise<T[]> {
    const queryString = new URLSearchParams(query).toString();
    if (queryString.length > 0) url += `?${queryString}`;
    url = `${weblateUrl}${url}`;

    const actualData = [];
    while (true) {
      const data = await fetchRaw(url);
      actualData.push(...data.results);

      if (data.next) {
        url = data.next;
        continue;
      }
      break;
    }
    return actualData;
  }

  async function* getAllStream<T = any>(
    url: string,
    query: any
  ): AsyncGenerator<T[]> {
    const queryString = new URLSearchParams(query).toString();
    if (queryString.length > 0) url += `?${queryString}`;
    url = `${weblateUrl}${url}`;

    while (true) {
      const { results, next } = await fetchRaw(url);
      yield results;
      if (next) {
        url = next;
        continue;
      }
      break;
    }
    return;
  }

  async function get(url: string, query: any): Promise<any> {
    const queryString = new URLSearchParams(query).toString();
    if (queryString.length > 0) url += `?${queryString}`;
    return await fetchRaw(`${weblateUrl}${url}`);
  }

  async function patch<T = any>(url: string, data: any): Promise<T> {
    return await fetchRaw(`${weblateUrl}${url}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  }

  async function fetchRaw(url: string, init?: RequestInit): Promise<any> {
    const resp = await fetch(url, {
      ...init,
      headers: {
        ...init?.headers,
        Authorization: `Bearer ${weblateToken}`,
      },
    });
    const text = await resp.text();
    let parsed: any = text;
    try {
      parsed = JSON.parse(text);
    } catch (ex) {
      console.warn(ex);
    }
    if (resp.status !== 200) {
      console.log(parsed);
      throw new Error(`invalid status code: ${resp.status}`);
    }
    return parsed;
  }

  async function post(url: string, body: any): Promise<any> {
    const resp = await fetch(`${weblateUrl}${url}`, {
      headers: {
        Authorization: `Bearer ${weblateToken}`,
        "Content-Type": "application/json",
      },
      method: "post",
      body: JSON.stringify(body),
    });
    return await resp.json();
  }
}

export type WeblateUnit = {
  translation: string;
  source: string[];
  previous_source: string;
  target: string[];
  id_hash: number;
  content_hash: number;
  location: string;
  context: string;
  note: string;
  flags: string;
  labels: WeblateLabel[];
  state: number;
  fuzzy: false;
  translated: true;
  approved: false;
  position: number;
  has_suggestion: false;
  source_unit: string;
  priority: number;
  id: number;
  web_url: string;
  url: string;
  explanation: string;
  extra_flags: string;
  pending: false;
  timestamp: string;
};

export type WeblateLabel = {
  id: number;
  name: string;
  color: string;
};
