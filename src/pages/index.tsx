import Tasks from "./dashboard/Tasks";
import { Fredoka } from "next/font/google";


export const fredoka = Fredoka({ subsets: ["latin"] });


export default function Home() {
  return (
    <>
      <Tasks/>
    </>
  );
}
