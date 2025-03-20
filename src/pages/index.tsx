import Tasks from "../Components/Tasks";
import { Fredoka } from "next/font/google";
import localFont from 'next/font/local';


export const fredoka = Fredoka({ subsets: ["latin"] });


export default function Home() {
  return (
    <>
      <Tasks/>
    </>
  );
}
