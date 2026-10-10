import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { WorkDetail } from "@/components/sections/WorkDetail";
import { WORKS, getWorkById, getWorkNeighbors } from "@/data/works";

type PageProps = {
  params: { id: string };
};

export function generateStaticParams() {
  return WORKS.map((work) => ({ id: work.id }));
}

export function generateMetadata({ params }: PageProps): Metadata {
  const work = getWorkById(params.id);
  if (!work) return { title: "Project — Livio Spaces" };

  return {
    title: `${work.title} — Livio Spaces`,
    description: work.description,
  };
}

export default function WorkProjectPage({ params }: PageProps) {
  const work = getWorkById(params.id);
  if (!work) notFound();

  const { prev, next, index } = getWorkNeighbors(work.id);
  if (!prev || !next || index < 0) notFound();

  return (
    <WorkDetail
      work={work}
      prev={prev}
      next={next}
      index={index}
      total={WORKS.length}
    />
  );
}
