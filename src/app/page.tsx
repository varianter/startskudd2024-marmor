import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";

export default async function Home() {
  return (
    <main>
      <div>
        <h1>Hello, World!</h1>
        <Link
          className={buttonVariants({ variant: "outline" })}
          href={"/dashboard"}
        >
          Go to dashboard
        </Link>
      </div>
    </main>
  );
}
