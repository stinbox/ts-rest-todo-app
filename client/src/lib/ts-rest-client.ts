import { contract } from "@monorepo/contract";
import { initClient } from "@ts-rest/core";

export const tsRestClient = initClient(contract, { baseUrl: "/" });
