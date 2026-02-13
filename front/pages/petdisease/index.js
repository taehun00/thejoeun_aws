// pages/petdisease/index.js
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  Row,
  Col,
  Card,
  Segmented,
  Spin,
  Alert,
  Typography,
  Empty,
  Button,
  Input,
  Select,
  Space,
  message,
} from "antd";

import {
  fetchPetdiseaseListRequest,
  searchPetdiseaseRequest,

  setPettypeid,
  setPageNo,
  setCondition,
  setKeyword,

  openDetail,
  closeDetail,
  fetchPetdiseaseDetailRequest,

  resetSearchState,

  createPetdiseaseRequest,
  updatePetdiseaseRequest,
  deletePetdiseaseRequest,
} from "../../reducers/petdisease/petdiseaseReducer";

import { parseJwt } from "../../utils/jwt";

// 모달 컴포넌트들
import PetdiseaseWriteModal from "../../components/petdisease/PetdiseaseWriteModal";
import PetdiseaseEditModal from "../../components/petdisease/PetdiseaseEditModal";
import PetdiseaseDetailModal from "../../components/petdisease/PetdiseaseDetailModal";

const { Title, Text } = Typography;

export default function PetdiseaseIndexPage() {
  const dispatch = useDispatch();

  const {
    list,
    loading,
    error,

    mode,
    pageNo,
    pageSize,
    pettypeid,
    condition,
    keyword,

    detail,

    //초기화 빼먹지 말기!!
    writeLoading,
    writeError,
    updateLoading,
    updateError,
    deleteLoading,
    deleteError,


  } = useSelector((state) => state.petdisease);

  // 관리자 권한 판단
  const [loginRole, setLoginRole] = useState(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const token = localStorage.getItem("accessToken");
    const payload = token ? parseJwt(token) : null;

    setLoginRole(payload?.role ?? null);
  }, []);

  const canAdmin = loginRole === "ROLE_ADMIN";

  // 상세 모달
  const [modalOpen, setModalOpen] = useState(false);

  // 글쓰기 모달
  const [writeOpen, setWriteOpen] = useState(false);

  // 수정 모달
  const [editOpen, setEditOpen] = useState(false);

  const petTypeOptions = useMemo(
    () => [
      { label: "고양이", value: 1 },
      { label: "강아지", value: 2 },
    ],
    []
  );

  const sortOptions = useMemo(
    () => [
      { label: "최신순", value: "new" },
      { label: "오래된순", value: "old" },
      { label: "질환명 ↑", value: "disnameAsc" },
      { label: "질환명 ↓", value: "disnameDesc" },
    ],
    []
  );

  // 초기 펫타입 - 고양이
  useEffect(() => {
    if (!pettypeid) {
      dispatch(setPettypeid(1));
      dispatch(setPageNo(1));
    }
  }, [pettypeid, dispatch]);

  // 페이지 진입 시 검색 초기화
  useEffect(() => {
    dispatch(resetSearchState());
  }, [dispatch]);

  // 목록/검색 호출 통합
  useEffect(() => {
    if (!pettypeid) return;

    if (mode === "search") {
      dispatch(
        searchPetdiseaseRequest({
          pettypeid,
          keyword,
          pageNo,
          pageSize,
          condition: condition || "new",
        })
      );
    } else {
      dispatch(
        fetchPetdiseaseListRequest({
          pettypeid,
          pageNo,
          pageSize,
          condition: condition || "new",
        })
      );
    }
  }, [dispatch, pettypeid, pageNo, pageSize, condition, mode, keyword, pageSize]);

  // crud 에러
    useEffect(() => {
        if (writeError) message.error(writeError);
    }, [writeError]);

    useEffect(() => {
    if (updateError) message.error(updateError);
    }, [updateError]);

    useEffect(() => {
    if (deleteError) message.error(deleteError);
    }, [deleteError]);

    //새로고침
    const refreshList = () => {
    if (!pettypeid) return;

    if (mode === "search") {
        dispatch(
        searchPetdiseaseRequest({
            pettypeid,
            keyword,
            pageNo,
            pageSize,
            condition: condition || "new",
        })
        );
    } else {
        dispatch(
        fetchPetdiseaseListRequest({
            pettypeid,
            pageNo,
            pageSize,
            condition: condition || "new",
        })
        );
    }
    };

    //수정 성공 후 
    const dto = detail?.dto;   //dto 빼기
    const dtoDisno = dto?.disno;

    const [prevUpdateLoading, setPrevUpdateLoading] = useState(false);

    useEffect(() => {
    if (prevUpdateLoading && !updateLoading && !updateError) {
        message.success("수정 완료");

        refreshList();

        if (dtoDisno) {
        dispatch(fetchPetdiseaseDetailRequest({ disno: dtoDisno }));
        }
    }

    setPrevUpdateLoading(updateLoading);
    }, [prevUpdateLoading, updateLoading, updateError, dtoDisno]);
    //삭제 성공 후
    const [prevDeleteLoading, setPrevDeleteLoading] = useState(false);

    useEffect(() => {
    if (prevDeleteLoading && !deleteLoading && !deleteError) {
        message.success("삭제 완료");

        // 상세 닫기(삭제된 글 보는 거 방지)
        setModalOpen(false);
        setEditOpen(false);
        dispatch(closeDetail());

        // 리스트 갱신
        refreshList();
    }
    setPrevDeleteLoading(deleteLoading);
    }, [prevDeleteLoading, deleteLoading, deleteError]);



  // 등록 성공 후 리프레시
  const [prevWriteLoading, setPrevWriteLoading] = useState(false);

  useEffect(() => {
    if (!pettypeid) return;

    // writeLoading true -> false + error 없음 => 성공
    if (prevWriteLoading && !writeLoading && !writeError) {
      message.success("등록 완료");

      if (mode === "search") {
        dispatch(
          searchPetdiseaseRequest({
            pettypeid,
            keyword,
            pageNo,
            pageSize,
            condition: condition || "new",
          })
        );
      } else {
        dispatch(
          fetchPetdiseaseListRequest({
            pettypeid,
            pageNo,
            pageSize,
            condition: condition || "new",
          })
        );
      }
    }

    setPrevWriteLoading(writeLoading);
  }, [
    prevWriteLoading,
    writeLoading,
    writeError,
    dispatch,
    mode,
    pettypeid,
    keyword,
    pageNo,
    pageSize,
    condition,
  ]);

  const onChangePetType = (value) => {
    dispatch(setPettypeid(value));
    dispatch(resetSearchState());

    setModalOpen(false);
    dispatch(closeDetail());
  };

  const onChangeCondition = (value) => {
    dispatch(setCondition(value));
    dispatch(setPageNo(1));
  };

  const onSearch = () => {
    if (!pettypeid) return;

    dispatch(setPageNo(1));
    dispatch(
      searchPetdiseaseRequest({
        pettypeid,
        keyword: keyword || "",
        pageNo: 1,
        pageSize,
        condition: condition || "new",
      })
    );
  };

  const onPressEnterSearch = () => {
    onSearch();
  };

  const onCardClick = (item) => {
    if (!item?.disno) return;

    setModalOpen(true);
    dispatch(openDetail(item.disno));
    dispatch(fetchPetdiseaseDetailRequest({ disno: item.disno }));
  };

  const onCloseModal = () => {
    setModalOpen(false);
    dispatch(closeDetail());
  };

  //const dto = detail?.dto;   위에 선언함 중복 조심

  // ===== 관리자 전용 =====

  const onOpenWrite = () => {
    if (!canAdmin) return;

    if (!pettypeid) {
      message.warning("펫 타입을 먼저 선택해주세요.");
      return;
    }

    setWriteOpen(true);
  };

  const onSubmitWrite = (values) => {
    if (!pettypeid) {
      message.error("펫 타입이 선택되지 않았습니다.");
      return;
    }

    dispatch(
      createPetdiseaseRequest({
        pettypeid,
        dto: values,
      })
    );

    setWriteOpen(false);
  };

  const onOpenEdit = () => {
    if (!canAdmin) return;
    if (!dto?.disno) return;
    setEditOpen(true);
  };

  const onSubmitEdit = ({ disno, dto: editDto }) => {
    dispatch(
      updatePetdiseaseRequest({
        disno,
        pettypeid,
        dto: editDto,
      })
    );

    setEditOpen(false);
  };

  const onDelete = () => {
    if (!canAdmin) return;
    if (!dto?.disno) return;

    dispatch(
      deletePetdiseaseRequest({
        disno: dto.disno,
      })
    );

    setModalOpen(false);
    setEditOpen(false);
    dispatch(closeDetail());
  };

  return (
    <div style={{ width: "80%", margin: "40px auto" }}>
      <Title level={3} style={{ textAlign: "center", marginBottom: 25 }}>
        반려동물 질환 정보
      </Title>

      {/* 글쓰기 버튼 */}
      {canAdmin && (
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 14 }}>
          <Button type="primary" onClick={onOpenWrite}>
            글쓰기
          </Button>
        </div>
      )}

      {/* 상단 펫 타입 버튼 */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
        <Segmented options={petTypeOptions} value={pettypeid || 1} onChange={onChangePetType} size="large" />
      </div>

      {/* 검색 + 정렬 */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 25 }}>
        <Space size={12} wrap>
          <Input
            value={keyword || ""}
            onChange={(e) => dispatch(setKeyword(e.target.value))}
            onPressEnter={onPressEnterSearch}
            placeholder="질환명 검색"
            style={{ width: 260 }}
            allowClear
          />
          <Button type="primary" onClick={onSearch}>
            검색
          </Button>

          <Select value={condition || "new"} onChange={onChangeCondition} options={sortOptions} style={{ width: 150 }} />
        </Space>
      </div>

      {/* 로딩/에러 */}
      {loading && (
        <div style={{ display: "flex", justifyContent: "center", margin: "60px 0" }}>
          <Spin size="large" />
        </div>
      )}

      {!loading && error && (
        <Alert
          type="error"
          showIcon
          message="질환 목록 조회 실패"
          description={typeof error === "string" ? error : JSON.stringify(error)}
          style={{ marginBottom: 20 }}
        />
      )}

      {/* 카드 */}
      {!loading && !error && (
        <>
          {list?.length === 0 ? (
            <Empty description={mode === "search" ? "검색 결과가 없습니다." : "질환 정보가 없습니다."} />
          ) : (
            <Row gutter={[20, 20]}>
              {list.map((item) => (
                <Col key={item.disno} xs={24} sm={12} md={8} lg={6}>
                  <Card
                    hoverable
                    onClick={() => onCardClick(item)}
                    style={{
                      borderRadius: 16,
                      height: 140,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                    }}
                    bodyStyle={{ padding: 18, width: "100%" }}
                  >
                    <Text style={{ fontSize: 16, fontWeight: 700, display: "block" }}>{item.disname}</Text>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      눌러서 상세보기
                    </Text>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </>
      )}

      {/* 상세 모달 */}
      <PetdiseaseDetailModal
        open={modalOpen}
        onClose={onCloseModal}
        dto={dto}
        detail={detail}
        canAdmin={canAdmin}
        onOpenEdit={onOpenEdit}
        onDelete={onDelete}
      />

      {/* 글쓰기 모달 */}
      <PetdiseaseWriteModal
        open={writeOpen}
        onClose={() => setWriteOpen(false)}
        onSubmit={onSubmitWrite}
        pettypeid={pettypeid || 1}
      />

      {/* 수정 모달 */}
      <PetdiseaseEditModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        onSubmit={onSubmitEdit}
        pettypeid={pettypeid || 1}
        dto={dto}
      />
    </div>
  );
}
