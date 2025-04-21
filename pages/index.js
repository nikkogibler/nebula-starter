export default function Home() {
  return (
    <div className="min-h-screen bg-gray-950 text-white px-6 py-12">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-4">Nebula 🌌</h1>
        <p className="text-lg text-gray-300 mb-8">
          Explore your saved universe. Use the prompt bar below to generate your custom layout.
        </p>
        <input
          type="text"
          placeholder="Try: Show my saved TikToks from 2022 in a moodboard"
          className="w-full bg-gray-800 text-white rounded-lg p-4 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
  );
}
