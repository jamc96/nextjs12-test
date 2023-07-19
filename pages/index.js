import useSWR from "swr";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import { useEffect, useState } from "react";

const fetcher = (...args) => fetch(...args).then((res) => res.json());
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
};

function MyContent({ post, handleClose }) {
  const [data, setData] = useState([]);
  useEffect(
    () => async () => {
      const comments = await fetcher(`http://localhost:3001/posts/${post.id}`);
      console.log("comment", comments);
      setData(comments);
    },
    []
  );

  return (
    <Box sx={{ ...style, width: 200 }}>
      <h2 id="child-modal-title">{post.title}</h2>
      <p>{data && data.body}</p>
      <Button onClick={handleClose}>Close Child Modal</Button>
    </Box>
  );
}

export default function Home() {
  const { data, error } = useSWR("http://localhost:3001/posts", fetcher);
  const [open, setOpen] = useState(false);
  const [post, setPost] = useState({});
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  return (
    <>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="child-modal-title"
        aria-describedby="child-modal-description"
      >
        <MyContent post={post} handleClose={handleClose} />
      </Modal>
      <div>
        my posts
        <ul>
          {data &&
            data.map((post) => (
              <li key={post.id}>
                <Button
                  onClick={() => {
                    handleOpen();
                    setPost(post);
                  }}
                >
                  {post.title}
                </Button>
              </li>
            ))}
        </ul>
      </div>
    </>
  );
}
