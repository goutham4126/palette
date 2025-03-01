import { checkUser } from "@/lib/auth"
async function page() {
  const user = await checkUser();
  if(!user)
  {
    return null;
  }
  return (
    <div>
        <a href="/projects" alt="Manual">Template Creation</a>
    </div> 
  )
}

export default page