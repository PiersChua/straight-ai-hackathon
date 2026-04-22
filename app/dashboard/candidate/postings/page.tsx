import PostingsList from "@/components/List/PostingsList";
import { prisma } from "@/lib/prisma";

const PostingsPage = async () => {
  const postings = await prisma.posting.findMany({
    include: {
      _count: {
        select: { interviews: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <header className="mb-12">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
            Discovery
          </h1>
          <p className="text-slate-500 mt-2">
            Explore opportunities based on your technical capability.
          </p>
        </header>

        <PostingsList initialPostings={postings} />
      </div>
    </main>
  );
};

export default PostingsPage;
