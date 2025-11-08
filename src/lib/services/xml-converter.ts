import { XMLParser, XMLBuilder, X2jOptions, XmlBuilderOptions } from "fast-xml-parser";

/**
 * Result type for conversion operations
 */
export type ConversionResult = {
  success: true;
  output: string;
  formatted: string;
} | {
  success: false;
  error: string;
};

/**
 * Convert XML to JSON
 * @param xml - The XML string to convert
 * @param options - Optional parser configuration
 */
export function convertXmlToJson(
  xml: string,
  options?: Partial<X2jOptions>
): ConversionResult {
  try {
    if (!xml || xml.trim().length === 0) {
      return {
        success: false,
        error: "XML input is required",
      };
    }

    const parserOptions: Partial<X2jOptions> = {
      ignoreAttributes: options?.ignoreAttributes ?? false,
      attributeNamePrefix: options?.attributeNamePrefix ?? "@_",
      textNodeName: options?.textNodeName ?? "#text",
      ignoreDeclaration: options?.ignoreDeclaration ?? false,
      trimValues: options?.trimValues ?? true,
      parseAttributeValue: options?.parseAttributeValue ?? false,
      parseTagValue: options?.parseTagValue ?? false,
      ...options,
    };

    const parser = new XMLParser(parserOptions);
    const result = parser.parse(xml);

    const output = JSON.stringify(result);
    const formatted = JSON.stringify(result, null, 2);

    return {
      success: true,
      output,
      formatted,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to parse XML",
    };
  }
}

/**
 * Convert JSON to XML
 * @param json - The JSON string to convert
 * @param options - Optional builder configuration
 */
export function convertJsonToXml(
  json: string,
  options?: Partial<XmlBuilderOptions>
): ConversionResult {
  try {
    if (!json || json.trim().length === 0) {
      return {
        success: false,
        error: "JSON input is required",
      };
    }

    // Parse JSON string to object
    const jsonObj = JSON.parse(json);

    const builderOptions: Partial<XmlBuilderOptions> = {
      format: options?.format ?? true,
      indentBy: options?.indentBy ?? "  ",
      attributeNamePrefix: options?.attributeNamePrefix ?? "@_",
      textNodeName: options?.textNodeName ?? "#text",
      ignoreAttributes: options?.ignoreAttributes ?? false,
      suppressEmptyNode: options?.suppressEmptyNode ?? false,
      ...options,
    };

    const builder = new XMLBuilder(builderOptions);
    const result = builder.build(jsonObj);

    return {
      success: true,
      output: result,
      formatted: result,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to parse JSON",
    };
  }
}

/**
 * Validate if string is valid XML
 * @param xml - The XML string to validate
 */
export function isValidXml(xml: string): boolean {
  try {
    if (!xml || xml.trim().length === 0) {
      return false;
    }
    const parser = new XMLParser();
    parser.parse(xml);
    return true;
  } catch {
    return false;
  }
}

/**
 * Validate if string is valid JSON
 * @param json - The JSON string to validate
 */
export function isValidJson(json: string): boolean {
  try {
    if (!json || json.trim().length === 0) {
      return false;
    }
    JSON.parse(json);
    return true;
  } catch {
    return false;
  }
}

/**
 * Pretty print XML
 * @param xml - The XML string to format
 */
export function formatXml(xml: string): ConversionResult {
  try {
    if (!xml || xml.trim().length === 0) {
      return {
        success: false,
        error: "XML input is required",
      };
    }

    const parser = new XMLParser({
      ignoreAttributes: false,
      ignoreDeclaration: false,
      attributeNamePrefix: "@_",
      textNodeName: "#text",
    });
    const parsed = parser.parse(xml);

    const builder = new XMLBuilder({
      format: true,
      indentBy: "  ",
      ignoreAttributes: false,
      attributeNamePrefix: "@_",
      textNodeName: "#text",
    });
    const formatted = builder.build(parsed);

    return {
      success: true,
      output: formatted,
      formatted,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to format XML",
    };
  }
}

/**
 * Pretty print JSON
 * @param json - The JSON string to format
 */
export function formatJson(json: string): ConversionResult {
  try {
    if (!json || json.trim().length === 0) {
      return {
        success: false,
        error: "JSON input is required",
      };
    }

    const parsed = JSON.parse(json);
    const formatted = JSON.stringify(parsed, null, 2);

    return {
      success: true,
      output: formatted,
      formatted,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to format JSON",
    };
  }
}

