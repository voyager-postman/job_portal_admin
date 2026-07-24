export const parseActiveFlag = (value) => {
  if (value === true || value === 1) return true;
  if (value === false || value === 0 || value == null) return false;

  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    if (
      normalized === "true" ||
      normalized === "1" ||
      normalized === "yes" ||
      normalized === "active"
    ) {
      return true;
    }
    if (
      normalized === "false" ||
      normalized === "0" ||
      normalized === "no" ||
      normalized === "inactive"
    ) {
      return false;
    }
  }

  return Boolean(value);
};

export const getConfigPayload = (response) =>
  response?.data?.data ?? response?.data ?? {};
