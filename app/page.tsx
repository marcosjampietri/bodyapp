import Link from "next/link";

export default async function Page() {
  return (
    <div>
      <Link href="/build">ADD EXERCISES</Link>
      <Link href="/history">VIEW HISTORY</Link>
    </div>
  );
}
