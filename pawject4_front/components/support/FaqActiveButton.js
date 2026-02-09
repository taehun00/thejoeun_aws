// components/support/FaqActiveButton.js
import { Button } from "antd";

/**
 * FAQ 활성/비활성 토글 버튼 (관리자 전용)
 *
 * props
 * - faqid: number
 * - isactive: 0|1
 * - loading?: boolean
 * - onToggle: (faqid)=>void
 */
export default function FaqActiveButton({
  faqid,
  isactive,
  loading = false,
  onToggle,
}) {
  const active = isactive === 1;

  return (
    <Button
      size="small"
      type={active ? "primary" : "default"}
      danger={!active}
      loading={loading}
      onClick={(e) => {
        e.stopPropagation();
        onToggle?.(faqid);
      }}
    >
      {active ? "활성화" : "비활성화"}
    </Button>
  );
}
