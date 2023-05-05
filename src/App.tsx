import { useEffect, useMemo, useState } from "react";
import { createApi } from "unsplash-js";
import * as nodeFetch from "node-fetch";
import {
  Col,
  Image,
  Input,
  Layout,
  Row,
  Space,
  Spin,
  Typography,
  notification,
} from "antd";
import { SearchOutlined } from "@ant-design/icons";
import debounce = require("lodash.debounce");
import idx from "idx";
import { Basic } from "unsplash-js/dist/methods/photos/types";
import "../src/App.css";
import Photo from "./components/Photo";
import InfiniteScroll from "react-infinite-scroll-component";
import { unionBy } from "lodash";

const unsplash = createApi({
  accessKey: "sNl6v0KeB0muIa0ToxprQgDv17QPgAS-0lXA5VwTxFw",
  cache: "force-cache",
});

const { Content, Footer } = Layout;
const { Title } = Typography;

const App = () => {
  const [inputSearch, setInputSearch] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);

  const [loading, setLoading] = useState<boolean>(false);

  const [data, setData] = useState<Basic[]>([]);
  const [likes, setLikes] = useState<string[]>([]);

  const handleLike = (id: string) => {
    if (likes.includes(id)) {
      setLikes((prevState) => prevState.filter((item) => item !== id));
    } else {
      setLikes((prevState) => [...prevState, id]);
    }
  };

  const handleFetchImages = () => {
    setLoading(true);
    if (inputSearch) {
      unsplash.search
        .getPhotos({
          query: inputSearch as string,
          page: page,
        })
        .then((result) => {
          const error = idx(result, (_) => _.errors[0]);
          if (error) {
            notification.error({
              message: `Error occurs ${error}`,
            });
          } else {
            const dataResult = idx(result, (_) => _.response.results) || [];
            const tempData = unionBy(dataResult, data, "id");
            setData(tempData);
            setPage((prevState) => prevState + 1);
          }
          setLoading(false);
        });
    } else {
      unsplash.photos
        .list({
          page: page,
        })
        .then((result) => {
          const error = idx(result, (_) => _.errors[0]);
          if (error) {
            notification.error({
              message: `Error occurs ${error}`,
            });
          } else {
            const dataResult = idx(result, (_) => _.response.results) || [];
            const tempData = unionBy(dataResult, data, "id");
            setData(tempData);
            setPage((prevState) => prevState + 1);
          }
          setLoading(false);
        });
    }
  };

  useEffect(() => {
    handleFetchImages();
  }, [inputSearch]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const result = e.target.value.trim();
    setData([]);
    setPage(1);
    setInputSearch(result);
  };

  const debouncedSearch = useMemo(() => {
    return debounce(handleSearch, 500);
  }, []);

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Content>
        <Row justify={"center"} style={{ paddingTop: "4rem" }}>
          <Space direction="vertical" size={"large"} style={{ width: "100%" }}>
            <Row justify={"center"}>
              <Title level={3}>My Unsplash</Title>
            </Row>
            <Row justify={"center"}>
              <Input
                prefix={<SearchOutlined />}
                placeholder="Search Image"
                style={{ width: "60%" }}
                onChange={debouncedSearch}
                allowClear
              />
            </Row>
            <Spin spinning={loading}>
              <Row justify={"center"}>
                <InfiniteScroll
                  dataLength={data.length}
                  next={handleFetchImages}
                  hasMore={true}
                  loader={<Spin />}
                >
                  <div className="column-base">
                    {data
                      ? data.map((item) => {
                          return (
                            <Photo
                              key={item.id}
                              like={likes.includes(item.id)}
                              handleLike={handleLike}
                              item={item}
                            />
                          );
                        })
                      : null}
                  </div>
                </InfiniteScroll>
              </Row>
            </Spin>
          </Space>
        </Row>
      </Content>
      <Footer></Footer>
    </Layout>
  );
};

export default App;
