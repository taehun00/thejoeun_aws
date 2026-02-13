// components/cs/AnswerStatusToggleButton.js
import { Button } from "antd";

/**
 * 1:1질문 답변 완료 전환 버튼 (관리자 전용)
 *
 * props
 * - questionid: number
 * - status: 0(대기)|1(완료)
 * - loading?: boolean
 * - onToggle: (questionid)=>void
 */
export default function AnswerStatusToggleButton({
  questionid,
  status,
  loading = false,
  onToggle,
}) {
  const isPending = status === 0;

  return (
    <Button
      size="small"
      type={isPending ? "primary" : "default"}
      danger={!isPending}
      loading={loading}
      onClick={(e) => {
        e.stopPropagation();
        onToggle?.(questionid);
      }}
    >
      {isPending ? "답변대기" : "답변완료"}
    </Button>
  );
}