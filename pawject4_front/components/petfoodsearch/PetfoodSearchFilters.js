// components/petfoodsearch/PetfoodSearchFilters.js
import { useMemo, useState, useCallback } from "react";
import { Card, Row, Col, Select, Input, Button, Space, Divider, InputNumber } from "antd";
import { SearchOutlined, FilterOutlined, ReloadOutlined } from "@ant-design/icons";

const { Option } = Select;

export default function PetfoodSearchFilters({
  initData,
  filters,
  onChangeFilters,
  onClickSearch,
  detailOpen,
  setDetailOpen,
}) {
//  const [detailOpen, setDetailOpen] = useState(false);    인덱스로 이동(ai박스 이슈)

  const brandList = initData?.brandList || [];
  const foodList = initData?.foodList || [];
  const rangeList = initData?.rangeList || [];

  // pettypeid/ brandid 조건에 맞는 사료만 노출
  const filteredFoodOptions = useMemo(() => {
    const pet = filters?.pettypeid ? String(filters.pettypeid) : "";
    const brand = filters?.brandid ? String(filters.brandid) : "";

    return foodList.filter((f) => {
      if (!f) return false;
      const foodPet = f.pettypeid != null ? String(f.pettypeid) : "";
      const foodBrand = f.brandid != null ? String(f.brandid) : "";

      const petOk = !pet || foodPet === pet;
      const brandOk = !brand || foodBrand === brand;

      return petOk && brandOk;
    });
  }, [foodList, filters?.pettypeid, filters?.brandid]);

  // 펫타입 선택에 따라 rangeList 필터링
  const filteredRangeOptions = useMemo(() => {
    const pet = filters?.pettypeid ? String(filters.pettypeid) : "";
    if (!pet) return rangeList;

    return rangeList.filter((r) => {
      if (!r) return false;
      const rangePet = r.pettypeid != null ? String(r.pettypeid) : "";
      return rangePet === pet;
    });
  }, [rangeList, filters?.pettypeid]);

  // 공통 변경
  const set = useCallback(
    (patch) => {
      onChangeFilters?.(patch);
    },
    [onChangeFilters]
  );

  //  전체 초기화 버튼
  const onReset = useCallback(() => {
    set({
      keyword: "",
      pettypeid: null,
      foodtype: null,
      brandid: null,
      foodid: null,
      category: null,
      petagegroup: null,
      isgrainfree: null,
      origin: null,
      rangeid: null,
      minvalue: null,
      maxvalue: null,
      condition: null,
    });
  }, [set]);

  // pettypeid 바꾸면 foodid/rangeid/petagegroup 리셋
  const onChangePettypeid = useCallback(
    (v) => {
      set({
        pettypeid: v ?? null,
        foodid: null,
        rangeid: null,
        petagegroup: null, // 연령도 추가 - 키튼/퍼피 구분
      });
    },
    [set]
  );

  // brandid 바꾸면 foodid 리셋
  const onChangeBrandid = useCallback(
    (v) => {
      set({
        brandid: v ?? null,
        foodid: null,
      });
    },
    [set]
  );

  return (
    <Card
      size="small"
      title="검색 조건"
      extra={
        <Space>
          {/*  초기화 버튼 */}
          <Button icon={<ReloadOutlined />} size="small" onClick={onReset}>
            초기화
          </Button>

          {/* 상세조건 토글 */}
          <Button
            icon={<FilterOutlined />}
            size="small"
            onClick={() => setDetailOpen((prev) => !prev)}
          >
            {detailOpen ? "상세조건 닫기" : "상세조건"}
          </Button>
        </Space>
      }
    >
      {/* 1줄: pettype / foodtype / brandid / foodid */}
      <Row gutter={[8, 8]}>
        <Col xs={24} sm={12} lg={6}>
          <Select
            style={{ width: "100%" }}
            placeholder="-- 모든 펫타입 --"
            value={filters?.pettypeid ?? ""}
            onChange={(v) => onChangePettypeid(v === "" ? null : v)}
          >
            <Option value="">-- 모든 펫타입 --</Option>
            <Option value={1}>고양이</Option>
            <Option value={2}>강아지</Option>
          </Select>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Select
            style={{ width: "100%" }}
            placeholder="-- 건식/습식 --"
            value={filters?.foodtype ?? ""}
            onChange={(v) => set({ foodtype: v === "" ? null : v })}
          >
            <Option value="">-- 건식/습식 --</Option>
            <Option value="건식">건식</Option>
            <Option value="습식">습식</Option>
          </Select>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Select
            style={{ width: "100%" }}
            placeholder="-- 모든 브랜드 --"
            value={filters?.brandid ?? ""}
            onChange={(v) => onChangeBrandid(v === "" ? null : v)}
            showSearch
            optionFilterProp="label"
            options={[
              { value: "", label: "-- 모든 브랜드 --" },
              ...brandList.map((b) => ({ value: b.brandid, label: b.brandname })),
            ]}
          />
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Select
            style={{ width: "100%" }}
            placeholder="-- 모든 사료 --"
            value={filters?.foodid ?? ""}
            onChange={(v) => set({ foodid: v === "" ? null : v })}
            showSearch
            optionFilterProp="label"
            options={[
              { value: "", label: "-- 모든 사료 --" },
              ...filteredFoodOptions.map((f) => ({ value: f.foodid, label: f.foodname })),
            ]}
          />
        </Col>
      </Row>

      {/* 2줄: keyword + search */}
      <Divider style={{ margin: "12px 0" }} />

      <Row gutter={[8, 8]} align="middle">
        <Col xs={24} lg={18}>
          <Input
            placeholder="찾으시는 사료나 재료를 입력해 주세요"
            value={filters?.keyword ?? ""}
            onChange={(e) => set({ keyword: e.target.value })}
            onPressEnter={onClickSearch}
          />
        </Col>
        <Col xs={24} lg={6}>
          <Button
            type="primary"
            icon={<SearchOutlined />}
            style={{ width: "100%" }}
            onClick={onClickSearch}
          >
            검색
          </Button>
        </Col>
      </Row>

      {/* 상세조건 패널 */}
      {detailOpen && (
        <>
          <Divider style={{ margin: "12px 0" }} />

          <Row gutter={[8, 8]}>
            <Col xs={24} sm={12} lg={6}>
              <Select
                style={{ width: "100%" }}
                placeholder="-- 모든 유형 --"
                value={filters?.category ?? ""}
                onChange={(v) => set({ category: v === "" ? null : v })}
              >
                <Option value="">-- 모든 유형 --</Option>
                <Option value="일반">일반</Option>
                <Option value="처방식">처방식</Option>
                <Option value="기능식">기능식</Option>
              </Select>
            </Col>

            <Col xs={24} sm={12} lg={6}>
              <Select
                style={{ width: "100%" }}
                placeholder="-- 모든 연령 --"
                value={filters?.petagegroup ?? ""}
                onChange={(v) => set({ petagegroup: v === "" ? null : v })}
              >
                <Option value="">-- 모든 연령 --</Option>
                <Option value="어덜트">어덜트</Option>
                <Option value="시니어">시니어</Option>

                {String(filters?.pettypeid || "") !== "1" && (
                  <Option value="퍼피">퍼피</Option>
                )}

                {String(filters?.pettypeid || "") !== "2" && (
                  <Option value="키튼">키튼</Option>
                )}
              </Select>
            </Col>

            <Col xs={24} sm={12} lg={6}>
              <Select
                style={{ width: "100%" }}
                placeholder="-- 그레인프리? --"
                value={filters?.isgrainfree ?? ""}
                onChange={(v) => set({ isgrainfree: v === "" ? null : v })}
              >
                <Option value="">-- 그레인프리? --</Option>
                <Option value="Y">Y</Option>
                <Option value="N">N</Option>
              </Select>
            </Col>

            <Col xs={24} sm={12} lg={6}>
              <Select
                style={{ width: "100%" }}
                placeholder="-- 국내/해외 --"
                value={filters?.origin ?? ""}
                onChange={(v) => set({ origin: v === "" ? null : v })}
              >
                <Option value="">-- 국내/해외 --</Option>
                <Option value="국내">국내</Option>
                <Option value="해외">해외</Option>
              </Select>
            </Col>
          </Row>

          <Row gutter={[8, 8]} style={{ marginTop: 8 }}>
            <Col xs={24} sm={12} lg={6}>
              <Select
                style={{ width: "100%" }}
                placeholder="-- 영양소 범위 --"
                value={filters?.rangeid ?? ""}
                onChange={(v) => set({ rangeid: v === "" ? null : v })}
                showSearch
                optionFilterProp="label"
                options={[
                  { value: "", label: "-- 영양소 범위 --" },
                  ...filteredRangeOptions.map((r) => ({
                    value: r.rangeid,
                    label: r.rangelabel,
                  })),
                ]}
              />
            </Col>

            {/* kcal min/max */}
            <Col xs={24} sm={12} lg={18}>
              <Space.Compact style={{ width: "100%" }}>
                <Input readOnly value="칼로리" style={{ width: 80, textAlign: "center" }} />

                <InputNumber
                  style={{ width: "100%" }}
                  placeholder="최소"
                  value={filters?.minvalue ?? null}
                  onChange={(v) => set({ minvalue: v ?? null })}
                />
                <Input readOnly value="~" style={{ width: 50, textAlign: "center" }} />
                <InputNumber
                  style={{ width: "100%" }}
                  placeholder="최대"
                  value={filters?.maxvalue ?? null}
                  onChange={(v) => set({ maxvalue: v ?? null })}
                />
                <Input readOnly value="kcal" style={{ width: 70, textAlign: "center" }} />
              </Space.Compact>
            </Col>
          </Row>
        </>
      )}
    </Card>
  );
}
