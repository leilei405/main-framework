"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Input,
  Button,
  Card,
  Row,
  Col,
  Select,
  DatePicker,
  Tabs,
  Empty,
  Spin,
  message,
  AutoComplete,
  Space,
  Tag,
  Modal,
  Form,
  Divider,
} from "antd";
import {
  SearchOutlined,
  FilterOutlined,
  SaveOutlined,
  HistoryOutlined,
  HeartOutlined,
} from "@ant-design/icons";
import { useAuth } from "@/contexts/AuthContext";
import { searchService } from "@/services/searchService";
import ItemCard from "@/components/ItemCard";
import MissingChildCard from "@/components/MissingChildCard";
import type {
  SearchParams,
  SearchResult,
  SavedSearch,
  SearchHistory,
} from "@/types/search";
import { SortBy, SEARCH_TYPE_LABELS, SORT_BY_LABELS } from "@/types/search";
import { CATEGORY_LABELS } from "@/types/item";

const { RangePicker } = DatePicker;
const { Option } = Select;
const { TabPane } = Tabs;

export default function SearchPage() {
  const { user, token, isAuthenticated } = useAuth();
  const [searchParams, setSearchParams] = useState<SearchParams>({});
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([]);
  const [searchHistory, setSearchHistory] = useState<SearchHistory[]>([]);
  const [saveModalVisible, setSaveModalVisible] = useState(false);
  const [historyModalVisible, setHistoryModalVisible] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    if (isAuthenticated) {
      loadSavedSearches();
      loadSearchHistory();
    }
  }, [isAuthenticated]);

  const loadSavedSearches = async () => {
    try {
      const searches = await searchService.getSavedSearches(token!);
      setSavedSearches(searches);
    } catch (error) {
      // 静默处理错误
    }
  };

  const loadSearchHistory = async () => {
    try {
      const history = await searchService.getSearchHistory(token!);
      setSearchHistory(history);
    } catch (error) {
      // 静默处理错误
    }
  };

  const handleSearch = async (params: SearchParams = searchParams) => {
    setLoading(true);
    try {
      const result = await searchService.search(params);
      setSearchResult(result);
      setSearchParams(params);
    } catch (error) {
      message.error("搜索失败");
    } finally {
      setLoading(false);
    }
  };

  const handleKeywordChange = useCallback(async (value: string) => {
    if (value.length > 1) {
      try {
        const suggestions = await searchService.getSearchSuggestions(value);
        setSuggestions(suggestions);
      } catch (error) {
        // 静默处理错误
      }
    } else {
      setSuggestions([]);
    }
  }, []);

  const handleQuickSearch = (keyword: string) => {
    const params = { ...searchParams, keyword };
    handleSearch(params);
  };

  const handleAdvancedSearch = (values: any) => {
    const params: SearchParams = {
      keyword: values.keyword,
      type: values.type,
      category: values.category,
      location: values.location,
      dateRange: values.dateRange
        ? [values.dateRange[0].toISOString(), values.dateRange[1].toISOString()]
        : undefined,
      radius: values.radius,
      sortBy: values.sortBy || SortBy.RELEVANCE,
    };
    handleSearch(params);
    setShowAdvanced(false);
  };

  const handleSaveSearch = async (values: any) => {
    try {
      await searchService.saveSearch(token!, values.name, searchParams);
      message.success("搜索已保存");
      setSaveModalVisible(false);
      loadSavedSearches();
    } catch (error) {
      message.error("保存失败");
    }
  };

  const handleUseSavedSearch = (savedSearch: SavedSearch) => {
    handleSearch(savedSearch.params);
  };

  const handleUseHistorySearch = (history: SearchHistory) => {
    handleSearch(history.params);
    setHistoryModalVisible(false);
  };

  const renderSearchResults = () => {
    if (!searchResult) return null;

    const { items, missingChildren, total } = searchResult;

    if (total === 0) {
      return (
        <Empty
          description="没有找到相关结果"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          style={{ padding: "60px 0" }}
        />
      );
    }

    return (
      <Tabs defaultActiveKey="all">
        <TabPane tab={`全部 (${total})`} key="all">
          <Row gutter={[16, 16]}>
            {items.map((item) => (
              <Col xs={24} sm={12} md={8} lg={6} key={`item-${item.id}`}>
                <ItemCard
                  item={item}
                  onView={(item) => {
                    // TODO: 打开物品详情
                    console.log("查看物品", item);
                  }}
                  onContact={(item) => {
                    // TODO: 联系功能
                    console.log("联系", item);
                  }}
                />
              </Col>
            ))}
            {missingChildren.map((child) => (
              <Col xs={24} sm={12} md={8} lg={6} key={`child-${child.id}`}>
                <MissingChildCard
                  child={child}
                  onView={(child) => {
                    // TODO: 打开儿童详情
                    console.log("查看儿童", child);
                  }}
                  onProvideTip={(child) => {
                    // TODO: 提供线索
                    console.log("提供线索", child);
                  }}
                />
              </Col>
            ))}
          </Row>
        </TabPane>
        <TabPane tab={`物品 (${items.length})`} key="items">
          <Row gutter={[16, 16]}>
            {items.map((item) => (
              <Col xs={24} sm={12} md={8} lg={6} key={item.id}>
                <ItemCard
                  item={item}
                  onView={(item) => console.log("查看物品", item)}
                  onContact={(item) => console.log("联系", item)}
                />
              </Col>
            ))}
          </Row>
        </TabPane>
        <TabPane tab={`失踪儿童 (${missingChildren.length})`} key="children">
          <Row gutter={[16, 16]}>
            {missingChildren.map((child) => (
              <Col xs={24} sm={12} md={8} lg={6} key={child.id}>
                <MissingChildCard
                  child={child}
                  onView={(child) => console.log("查看儿童", child)}
                  onProvideTip={(child) => console.log("提供线索", child)}
                />
              </Col>
            ))}
          </Row>
        </TabPane>
      </Tabs>
    );
  };

  return (
    <div>
      {/* 搜索栏 */}
      <Card style={{ marginBottom: 16 }}>
        <Row gutter={16} align="middle">
          <Col flex="auto">
            <AutoComplete
              size="large"
              placeholder="搜索物品、失踪儿童..."
              options={suggestions.map((suggestion) => ({ value: suggestion }))}
              onSearch={handleKeywordChange}
              onSelect={handleQuickSearch}
              style={{ width: "100%" }}
            >
              <Input.Search
                size="large"
                enterButton={<SearchOutlined />}
                onSearch={handleQuickSearch}
              />
            </AutoComplete>
          </Col>
          <Col>
            <Space>
              <Button
                icon={<FilterOutlined />}
                onClick={() => setShowAdvanced(!showAdvanced)}
              >
                高级搜索
              </Button>
              {isAuthenticated && (
                <>
                  <Button
                    icon={<SaveOutlined />}
                    onClick={() => setSaveModalVisible(true)}
                  >
                    保存搜索
                  </Button>
                  <Button
                    icon={<HistoryOutlined />}
                    onClick={() => setHistoryModalVisible(true)}
                  >
                    搜索历史
                  </Button>
                </>
              )}
            </Space>
          </Col>
        </Row>

        {/* 快速搜索标签 */}
        <div style={{ marginTop: 16 }}>
          <Space wrap>
            <span>热门搜索：</span>
            {["手机", "钱包", "身份证", "钥匙", "背包", "眼镜"].map((tag) => (
              <Tag
                key={tag}
                style={{ cursor: "pointer" }}
                onClick={() => handleQuickSearch(tag)}
              >
                {tag}
              </Tag>
            ))}
          </Space>
        </div>

        {/* 高级搜索表单 */}
        {showAdvanced && (
          <div
            style={{
              marginTop: 16,
              padding: 16,
              background: "#fafafa",
              borderRadius: 6,
            }}
          >
            <Form layout="inline" onFinish={handleAdvancedSearch}>
              <Form.Item name="keyword" style={{ minWidth: 200 }}>
                <Input placeholder="关键词" />
              </Form.Item>
              <Form.Item name="type">
                <Select placeholder="类型" style={{ width: 120 }} allowClear>
                  {Object.entries(SEARCH_TYPE_LABELS).map(([value, label]) => (
                    <Option key={value} value={value}>
                      {label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item name="category">
                <Select placeholder="分类" style={{ width: 120 }} allowClear>
                  {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
                    <Option key={value} value={value}>
                      {label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item name="location">
                <Input placeholder="地点" style={{ width: 150 }} />
              </Form.Item>
              <Form.Item name="dateRange">
                <RangePicker placeholder={["开始日期", "结束日期"]} />
              </Form.Item>
              <Form.Item name="sortBy">
                <Select
                  placeholder="排序"
                  style={{ width: 120 }}
                  defaultValue={SortBy.RELEVANCE}
                >
                  {Object.entries(SORT_BY_LABELS).map(([value, label]) => (
                    <Option key={value} value={value}>
                      {label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  搜索
                </Button>
              </Form.Item>
            </Form>
          </div>
        )}
      </Card>

      {/* 搜索结果 */}
      <Spin spinning={loading}>
        {searchResult && (
          <Card
            title={`搜索结果 (${searchResult.total})`}
            extra={
              searchResult.matches.length > 0 && (
                <Tag color="green" icon={<HeartOutlined />}>
                  发现 {searchResult.matches.length} 个可能匹配
                </Tag>
              )
            }
          >
            {renderSearchResults()}
          </Card>
        )}
      </Spin>

      {/* 保存搜索模态框 */}
      <Modal
        title="保存搜索"
        open={saveModalVisible}
        onCancel={() => setSaveModalVisible(false)}
        footer={null}
      >
        <Form form={form} onFinish={handleSaveSearch} layout="vertical">
          <Form.Item
            label="搜索名称"
            name="name"
            rules={[{ required: true, message: "请输入搜索名称!" }]}
          >
            <Input placeholder="给这个搜索起个名字" />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                保存
              </Button>
              <Button onClick={() => setSaveModalVisible(false)}>取消</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* 搜索历史模态框 */}
      <Modal
        title="搜索历史"
        open={historyModalVisible}
        onCancel={() => setHistoryModalVisible(false)}
        footer={null}
        width={600}
      >
        <div>
          <h4>保存的搜索</h4>
          {savedSearches.map((search) => (
            <Card key={search.id} size="small" style={{ marginBottom: 8 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <strong>{search.name}</strong>
                  <div style={{ fontSize: "12px", color: "#999" }}>
                    创建于 {new Date(search.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <Button
                  size="small"
                  onClick={() => handleUseSavedSearch(search)}
                >
                  使用
                </Button>
              </div>
            </Card>
          ))}

          <Divider />

          <h4>搜索历史</h4>
          {searchHistory.slice(0, 10).map((history) => (
            <Card key={history.id} size="small" style={{ marginBottom: 8 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <strong>{history.keyword || "高级搜索"}</strong>
                  <div style={{ fontSize: "12px", color: "#999" }}>
                    {history.resultCount} 个结果 ·{" "}
                    {new Date(history.searchTime).toLocaleString()}
                  </div>
                </div>
                <Button
                  size="small"
                  onClick={() => handleUseHistorySearch(history)}
                >
                  重新搜索
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </Modal>
    </div>
  );
}
