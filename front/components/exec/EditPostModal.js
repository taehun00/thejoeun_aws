import { Modal, Form, Input, Upload, Button, Select } from "antd";
import { useEffect } from "react";
import { fileUrl } from "../../utils/fileUrl";

export default function EditPostModal({
  visible,
  editPost,
  onCancel,
  onSubmit,
  uploadFiles,
  setUploadFiles,
}) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (!editPost) return;

    form.setFieldsValue({
      content: editPost?.content || "",
      hashtags: Array.isArray(editPost?.hashtags)
        ? editPost.hashtags
        : editPost?.hashtags
        ? editPost.hashtags.split(",")
        : [],
    });

    // 기존 서버 이미지 → Upload 형식으로 변환 (문자열 URL만 넣어야 함)
    if (Array.isArray(editPost?.imageUrls)) {
      const existingFiles = editPost.imageUrls.map((img, index) => ({
        uid: `existing-${index}`,
        name: `image-${index}`,
        status: "done",
        url: fileUrl(img), // 문자열 URL로 강제 변환 (핵심)
      }));
      setUploadFiles(existingFiles);
    } else {
      setUploadFiles([]);
    }
  }, [editPost, form, setUploadFiles]);

  return (
    <Modal
      title="글 수정"
      open={visible}
      onCancel={onCancel}
      footer={null}
      destroyOnClose
    >
      <Form form={form} onFinish={onSubmit} layout="vertical">
        <Form.Item name="content" label="내용">
          <Input.TextArea rows={4} />
        </Form.Item>

        <Form.Item name="hashtags" label="해시태그">
          <Select
            mode="tags"
            style={{ width: "100%" }}
            placeholder="해시태그 입력"
          />
        </Form.Item>

        <Form.Item label="이미지 업로드">
          <Upload
            multiple
            beforeUpload={() => false}
            fileList={uploadFiles || []}
            onChange={({ fileList }) => {
              // antd UploadFile 구조 그대로 유지 (File / url 혼합 안전)
              setUploadFiles(fileList);
            }}
          >
            <Button>이미지 선택</Button>
          </Upload>
        </Form.Item>

        <Button type="primary" htmlType="submit">
          수정 완료
        </Button>
      </Form>
    </Modal>
  );
}
