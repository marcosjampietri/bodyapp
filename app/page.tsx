import Link from "next/link";

export default async function Page() {
  return (
    <div>
      <Link href="/workout/build">ADD EXERCISES</Link>
      <Link href="/workout/history">VIEW HISTORY</Link>
    </div>
  );
}
