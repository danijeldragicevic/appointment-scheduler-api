import path from "path";
import SwaggerParser from "@apidevtools/swagger-parser";
import Ajv, { ValidateFunction } from "ajv";
import addFormats from "ajv-formats";

const OPENAPI_PATH = path.join(__dirname, "../../../docs/openapi.yaml");

const ajv = new Ajv({ strict: false });
addFormats(ajv);

let specPromise: Promise<Record<string, any>> | null = null;

function loadSpec(): Promise<Record<string, any>> {
  specPromise ??= SwaggerParser.dereference(OPENAPI_PATH) as Promise<Record<string, any>>;
  return specPromise;
}

async function getResponseSchema(
  pathTemplate: string,
  method: string,
  status: number
): Promise<Record<string, unknown>> {
  const spec = await loadSpec();
  const operation = spec.paths?.[pathTemplate]?.[method.toLowerCase()];
  if (!operation) {
    throw new Error(`No operation found for ${method.toUpperCase()} ${pathTemplate} in openapi.yaml`);
  }

  const response = operation.responses?.[String(status)];
  if (!response) {
    throw new Error(`No ${status} response documented for ${method.toUpperCase()} ${pathTemplate} in openapi.yaml`);
  }

  const schema = response.content?.["application/json"]?.schema;
  if (!schema) {
    throw new Error(
      `No application/json schema for the ${status} response of ${method.toUpperCase()} ${pathTemplate}`
    );
  }

  return schema;
}

const compiledCache = new Map<string, ValidateFunction>();

export async function expectMatchesSchema(
  body: unknown,
  pathTemplate: string,
  method: string,
  status: number
): Promise<void> {
  const cacheKey = `${method.toUpperCase()} ${pathTemplate} ${status}`;

  let validate = compiledCache.get(cacheKey);
  if (!validate) {
    const schema = await getResponseSchema(pathTemplate, method, status);
    validate = ajv.compile(schema);
    compiledCache.set(cacheKey, validate);
  }

  if (!validate(body)) {
    throw new Error(
      `Response body for ${cacheKey} does not match its docs/openapi.yaml schema:\n` +
        `${ajv.errorsText(validate.errors)}\n\nBody: ${JSON.stringify(body, null, 2)}`
    );
  }
}
