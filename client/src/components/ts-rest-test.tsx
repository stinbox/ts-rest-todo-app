import { useEffect, useState } from "react";
import { tsRestClient } from "../lib/ts-rest-client";

export const TSRestTest = () => {
  const [data, setData] = useState<unknown>(null);

  useEffect(() => {
    tsRestClient
      .greeting({ query: { name: "test" } })
      .then((res) => setData(res));
  }, []);

  return <pre>{JSON.stringify(data, null, 2)}</pre>;
};
