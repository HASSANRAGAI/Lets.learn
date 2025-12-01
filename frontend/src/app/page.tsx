export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-100 to-purple-100">
      {/* Header */}
      <header className="bg-indigo-600 text-white py-4 px-6 shadow-lg">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold">🎮 Lets Learn</h1>
          <span className="text-sm bg-indigo-500 px-3 py-1 rounded-full">
            Scratch for Kids!
          </span>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-indigo-800 mb-4">
            🐱 Meet Scratch!
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Learn to code with fun games and adventures! 
            Perfect for kids age 7 and up.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="text-4xl mb-4">🎨</div>
            <h3 className="text-xl font-bold text-indigo-700 mb-2">
              Fun & Colorful
            </h3>
            <p className="text-gray-600">
              Create colorful projects and bring your ideas to life!
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="text-xl font-bold text-indigo-700 mb-2">
              Easy to Learn
            </h3>
            <p className="text-gray-600">
              Step-by-step lessons designed just for young learners!
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="text-4xl mb-4">🏆</div>
            <h3 className="text-xl font-bold text-indigo-700 mb-2">
              Earn Badges
            </h3>
            <p className="text-gray-600">
              Complete lessons and collect awesome achievement badges!
            </p>
          </div>
        </div>

        {/* Lessons Preview */}
        <section className="bg-white rounded-2xl p-8 shadow-lg">
          <h3 className="text-2xl font-bold text-indigo-800 mb-6 text-center">
            🚀 Start Your Adventure!
          </h3>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-green-50 rounded-xl border-2 border-green-200">
              <span className="text-3xl">1️⃣</span>
              <div>
                <h4 className="font-bold text-green-700">Meet Scratch the Cat!</h4>
                <p className="text-sm text-gray-600">
                  Learn about your new friend and how to make him move!
                </p>
              </div>
              <span className="ml-auto text-green-500">⏱️ 10 min</span>
            </div>

            <div className="flex items-center gap-4 p-4 bg-yellow-50 rounded-xl border-2 border-yellow-200">
              <span className="text-3xl">2️⃣</span>
              <div>
                <h4 className="font-bold text-yellow-700">Making Scratch Dance</h4>
                <p className="text-sm text-gray-600">
                  Teach Scratch some cool dance moves with simple commands!
                </p>
              </div>
              <span className="ml-auto text-yellow-600">⏱️ 15 min</span>
            </div>

            <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-xl border-2 border-blue-200">
              <span className="text-3xl">3️⃣</span>
              <div>
                <h4 className="font-bold text-blue-700">Scratch Says Hello!</h4>
                <p className="text-sm text-gray-600">
                  Make Scratch talk and say funny things!
                </p>
              </div>
              <span className="ml-auto text-blue-500">⏱️ 10 min</span>
            </div>
          </div>

          <div className="text-center mt-8">
            <button className="bg-indigo-600 text-white px-8 py-3 rounded-full text-lg font-bold hover:bg-indigo-700 transition-colors shadow-lg">
              Let&apos;s Start Learning! 🎉
            </button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-indigo-800 text-white py-6 mt-12">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-sm opacity-80">
            🎮 Lets Learn - Making coding fun for kids! 
          </p>
          <p className="text-xs mt-2 opacity-60">
            Works offline too! Install as an app on your device.
          </p>
        </div>
      </footer>
    </div>
  );
}
