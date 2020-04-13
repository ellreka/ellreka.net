import { useEffect, useState } from "react";
import { NextPage } from "next";
import ReactMarkdown from "react-markdown";
import Layout from "../../components/Layout";
import { fetchEntry } from "../../api";
import { Prism } from "react-syntax-highlighter";
import { xonokai } from "react-syntax-highlighter/dist/cjs/styles/prism";

const PrismRender: NextPage<{
  value: string;
  language: string;
}> = ({ value, language }) => (
  <Prism language={language} style={xonokai}>
    {value}
  </Prism>
);

const Post: NextPage<{ id: string | string[] }> = ({ id }) => {
  const [post, setPost] = useState<{
    id: string;
    createdAt: string;
    title: string;
    body: string;
  }>({
    id: "",
    createdAt: "",
    title: "",
    body: "",
  });
  useEffect(() => {
    const getPost = async () => {
      const entry = await fetchEntry(String(id));
      setPost({
        id: entry.sys.id,
        createdAt: entry.sys.createdAt,
        title: entry.fields.title,
        body: entry.fields.body,
      });
    };
    getPost();
  }, [id]);
  return (
    <Layout>
      <article className="bg-white rounded-lg px-8 py-5">
        <h1 className="text-4xl text-center">{post.title}</h1>
        <div className="content">
          <ReactMarkdown source={post.body} renderers={{ code: PrismRender }} />
        </div>
      </article>
      <style jsx global>{`
        .content {
          color: #333333;
          margin: 30px 0;
        }
        .content h2 {
          font-size: 1.5rem;
          border-bottom: 1px solid #e2e8f0;
          margin-bottom: 20px;
        }
        .content ul li:before {
          content: "- ";
        }
        .content blockquote {
          border-left: 5px solid #ddd;
          color: #777;
          padding-left: 10px;
        }
        .content blockquote {
        }
        .content a {
          text-decoration: none;
          color: #90cdf4;
        }

        .content a:hover {
          opacity: 0.6;
        }

        .content h3 {
          margin: 0;
          padding: 0;
          text-transform: uppercase;
        }
      `}</style>
    </Layout>
  );
};
Post.getInitialProps = async (context) => {
  const { id } = context.query;
  return { id };
};
export default Post;
