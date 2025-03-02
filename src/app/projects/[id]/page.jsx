import Playground from "../_components/Playground";

async function Page({ params }) {
  const projectId = params.id;

  return (
    <div>
      <Playground template="static" projectId={projectId} />
    </div>
  );
}

export default Page;