import Playground from "../_components/Playground";

async function Page({ params }) {
  const { id } = await params;

  return (
    <div>
      <Playground template="static" projectId={id} />
    </div>
  );
}

export default Page;