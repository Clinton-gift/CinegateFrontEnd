// src/lib/assetUri.js
import { Asset } from "expo-asset";

export function assetUri(moduleOrId) {
  // moduleOrId can be require(...) result OR imported module from assets
  const a = Asset.fromModule(moduleOrId);
  return a?.uri || "";
}