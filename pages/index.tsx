import { useEffect, useState } from "react";
// import Head from "next/head";
import Post from "../components/post";

const contentful = require("contentful");
const client = contentful.createClient({
  space: process.env.CONTENTFUL_SPACE_ID,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN
});
function HomePage() {
  async function fetchEntries() {
    const entries = await client.getEntries();
    if (entries.items) return entries.items;
  }

  const [posts, setPosts] = useState([]);
  console.log(posts);

  useEffect(() => {
    async function getPosts() {
      const allEntries = await fetchEntries();
      const allPosts = allEntries.map(val => {
        return {
          id: val.sys.id,
          createdAt: val.sys.createdAt,
          title: val.fields.title,
          content: val.fields.content.content
        };
      });
      setPosts([...allPosts]);
    }
    getPosts();
  }, []);

  return (
    <>
      <h1>ellreka</h1>
      {posts.length > 0
        ? posts.map((p, key) => (
            <Post title={p.title} content={p.content.nodeType} key={key} />
          ))
        : null}
    </>
  );
}

export default HomePage;
