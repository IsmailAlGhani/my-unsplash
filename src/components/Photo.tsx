import { Image, Typography } from "antd";
import { Basic } from "unsplash-js/dist/methods/photos/types";
import "../components/Photo.css";
import { FC } from "react";
import { HeartFilled, HeartOutlined } from "@ant-design/icons";

const { Text } = Typography;

type PhotoProps = {
  item: Basic;
  like: boolean;
  handleLike: (id: string) => void;
};

const Photo: FC<PhotoProps> = ({ item, like = false, handleLike }) => {
  return (
    <div className="card-wrapper">
      <Image
        key={item.id}
        alt={item.alt_description || undefined}
        width={200}
        src={item.urls.thumb}
        preview={{
          src: item.urls.regular,
        }}
      />
      <div className="like-wrapper" onClick={() => handleLike(item.id)}>
        {like ? (
          <HeartFilled style={{ color: "red" }} />
        ) : (
          <HeartOutlined style={{ color: "red" }} />
        )}
      </div>
      <Text className="author">{`By ${item.user.name}`}</Text>
    </div>
  );
};

export default Photo;
