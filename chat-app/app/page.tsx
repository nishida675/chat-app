

export const runtime = "edge";

export default async function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-4 sm:p-6 md:p-24"> 
      <h1 className="mt-3 text-4xl font-semibold sm:text-5xl md:text-6xl">
        チーム開発
      </h1>
      <h4 className="mt-3 text-1xl font-semibold sm:text-3xl">
        メッセージアプリ
      </h4>
    </main>
  );
}