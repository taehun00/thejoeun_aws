import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import EditForm from "../../components/user/EditForm";
import {
  updateMeRequest,
  updateProfileImageRequest,
} from "../../reducers/user/authReducer";

function EditPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { user, loading } = useSelector((state) => state.auth);

  const [form, setForm] = useState({
    password: "",
    nickname: "",
    mobile: "",
  });

  const [file, setFile] = useState(null);

  useEffect(() => {
    if (user) {
      setForm({
        password: "",
        nickname: user.nickname || "",
        mobile: user.mobile || "",
      });
    }
  }, [user]);

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = () => {
    const payload = {
      nickname: form.nickname,
      mobile: form.mobile,
    };

    if (form.password) {
      payload.password = form.password;
    }

    dispatch(updateMeRequest(payload));

    if (file && user?.userId) {
      dispatch(
        updateProfileImageRequest({
          userId: user.userId,
          file,
        })
      );
    }

    router.push("/user/mypage");
  };

  return (
    <EditForm
      form={form}
      loading={loading}
      onChange={handleChange}
      onFileChange={(e) => setFile(e.target.files[0])}
      onSubmit={handleSubmit}
    />
  );
}

export default EditPage;
