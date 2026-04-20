import { auth } from "@/lib/auth";
import { headers } from "next/headers";

const Home = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <div>
      Hello World
      {session?.user.email && <p>Your email is {session.user.email}</p>}
      {session?.user.name && <p>Your name is {session.user.name}</p>}
      {session?.user.role && <p>Your role is {session.user.role}</p>}
    </div>
  );
};

export default Home;
