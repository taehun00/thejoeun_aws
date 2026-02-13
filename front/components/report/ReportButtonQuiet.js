import { useState } from "react";
import { Modal, Select, Input, Button, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { reportRequest, resetReportState } from "../../reducers/report/reportReducer";
import { FlagOutlined } from "@ant-design/icons";

const { TextArea } = Input;

export default function ReportButtonQuiet({ targetType, targetId }) {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.report);

  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [details, setDetails] = useState("");

  const submit = () => {
    if (!reason) {
      message.error("신고 사유를 선택해주세요");
      return;
    }

    dispatch(reportRequest({ targetType, targetId, reason, details }));
    message.success("신고가 접수되었습니다");

    setOpen(false);
    setReason("");
    setDetails("");
    dispatch(resetReportState());
  };

  return (
    <>
      {/*  존재감 낮춘 신고 버튼 */}
      <Button
        type="text"
        size="small"
        icon={<FlagOutlined />}
        onClick={() => setOpen(true)}
        style={{
          padding: "0 6px",
          color: "#8c8c8c",
        }}
      >
        신고
      </Button>

      <Modal
        title="신고하기"
        open={open}
        onOk={submit}
        onCancel={() => setOpen(false)}
        okButtonProps={{ loading }}
      >
        <Select
          style={{ width: "100%", marginBottom: 10 }}
          placeholder="신고 사유"
          value={reason}
          onChange={setReason}
        >
          <Select.Option value="욕설">욕설</Select.Option>
          <Select.Option value="음란물">음란물</Select.Option>
          <Select.Option value="광고">광고</Select.Option>
          <Select.Option value="기타">기타</Select.Option>
        </Select>

        <TextArea
          rows={3}
          placeholder="상세 사유 (선택)"
          value={details}
          onChange={(e) => setDetails(e.target.value)}
        />
      </Modal>
    </>
  );
}