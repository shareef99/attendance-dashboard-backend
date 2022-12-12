import type { SafeParseReturnType } from "zod";

export const validateReq = (
  data: SafeParseReturnType<any, any>
): { error: boolean; value: Array<string> | any } => {
  if (!data.success) {
    return {
      error: true,
      value: data.error.issues.map(
        (issue) =>
          `${issue.path.length > 0 ? issue.path.toString() + ": " : ""}${
            issue.message
          }`
      ),
    };
  }
  return { error: false, value: data.data };
};
