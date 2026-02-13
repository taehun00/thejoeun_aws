// utils/cleanParams.js

/**
 * 검색 파라미터 정리 유틸
 * - "" / null / undefined 값은 key 자체를 제거한다.
 * - axios params 직렬화로 "" 들어가서 MyBatis 조건문이 꼬이는 문제 방지
 */
export function cleanParams(obj) {
  const out = { ...(obj || {}) };

  Object.keys(out).forEach((k) => {
    const v = out[k];

    // 빈 문자열 제거
    if (typeof v === "string" && v.trim() === "") {
      delete out[k];
      return;
    }

    // null/undefined 제거
    if (v === null || v === undefined) {
      delete out[k];
      return;
    }
  });

  return out;
}
