import { useEffect, useState } from "react";
import { NextPage } from "next";
import Link from "next/link";
import Layout from "../components/Layout";
import { fetchEntries } from "../api";

const Home: NextPage = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const getPosts = async () => {
      const allEntries = await fetchEntries();
      console.log(allEntries);
      const allPosts = allEntries.map((val) => {
        return {
          id: val.sys.id,
          createdAt: val.sys.createdAt,
          title: val.fields.title,
          body: val.fields.body,
        };
      });
      setPosts([...allPosts]);
    };
    getPosts();
  }, [setPosts]);

  return (
    <Layout>
      <div className="bg-white rounded-lg">
        {posts.map((val) => (
          <div className="px-3 py-5 border-b">
            <h2 className="text-black">
              <Link href="/post/[val.id]" as={`/post/${val.id}`}>
                <a className="hover:underline">{val.title}</a>
              </Link>
            </h2>
            <div>
              <a href="#">javascript</a>
              <a href="#">react</a>
            </div>
            <time className="text-gray-400">{val.createdAt}</time>
          </div>
        ))}
      </div>
    </Layout>
  );
};

export default Home;
