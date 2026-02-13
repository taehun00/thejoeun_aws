export function fileUrl(path) {
  if (!path) return "";

  // 이미 절대경로면 그대로
  if (typeof path === "string" &&
      (path.startsWith("http://") || path.startsWith("https://"))) {
    return path;
  }

  // path가 "/uploads/xxx" 형태면 그대로
  if (path.startsWith("/uploads/")) return path;

  // DB 저장 값: reviewimg/xxx.jpg
  return `/uploads/${path}`;
}
