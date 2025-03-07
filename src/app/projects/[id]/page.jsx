import Playground from "../_components/Playground";

async function page({ params }) {
  const { id } = await params;

  return (
    <div>
      <Playground template="static" projectId={id} />
    </div>
  );
}

export default page;