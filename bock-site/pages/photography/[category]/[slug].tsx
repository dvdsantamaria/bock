import { useRouter } from "next/router";
import type { GetStaticPaths, GetStaticProps } from "next";
import type { PhotographyBlock } from "@/types/photography";
import { useEffect, useState } from "react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:1337";

interface Props {
  block: PhotographyBlock | null;
  blocks: PhotographyBlock[];
}

function renderBody(
  body: string | { type: string; children: { text: string }[] }[]
) {
  if (typeof body === "string") {
    return <p>{body}</p>;
  }

  if (Array.isArray(body)) {
    return body.map((block, idx) => (
      <p key={idx}>
        {block.children?.map((c, i) => (
          <span key={i}>{c.text}</span>
        ))}
      </p>
    ));
  }

  return null;
}

export default function PhotographySlugPage({ block, blocks }: Props) {
  const router = useRouter();

  if (router.isFallback) {
    return <div>Loading…</div>;
  }

  if (!block) {
    return <div>Photo not found</div>;
  }

  return (
    <div style={{ padding: "2rem" }}>
      <h1>{block.title}</h1>
      <h2>{block.subtitle}</h2>
      <div>{renderBody(block.body)}</div>
      {block.imageFull && (
        <img
          src={block.imageFull}
          alt={block.title}
          style={{ maxWidth: "100%" }}
        />
      )}
    </div>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const res = await fetch(`${API}/api/photos?populate=*`);
  const data = await res.json();

  const paths =
    data?.data?.map((it: any) => {
      const slug = it.attributes?.slug ?? "";
      const [category, subslug] = slug.split("/");
      return {
        params: { category, slug: subslug },
      };
    }) || [];

  return {
    paths,
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const res = await fetch(
    `${API}/api/photos?populate=Category,imageThumb,imageFull`
  );
  const data = await res.json();

  const all: PhotographyBlock[] =
    data?.data?.map((it: any) => {
      const a = it.attributes || {};
      return {
        id: it.id,
        title: a.title,
        subtitle: a.subtitle,
        slug: a.slug,
        body: a.body || a.content || "",
        category: a.Category?.data?.attributes?.slug || "uncategorised",
        imageThumb: a.imageThumb?.data?.attributes?.url
          ? `${API}${a.imageThumb.data.attributes.url}`
          : undefined,
        imageFull: a.imageFull?.data?.attributes?.url
          ? `${API}${a.imageFull.data.attributes.url}`
          : undefined,
      };
    }) || [];

  const slug = `${params?.category}/${params?.slug}`;
  const block = all.find((p) => p.slug === slug) || null;

  return {
    props: {
      block,
      blocks: all,
    },
    revalidate: 300,
  };
};
