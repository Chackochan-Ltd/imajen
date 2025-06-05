
import React, { useState, useCallback } from 'react';
import { PromptInput } from './components/PromptInput';
import { ImageDisplay } from './components/ImageDisplay';
import { ReviewNotes } from './components/ReviewNotes';
import { Button } from './components/Button';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ErrorAlert } from './components/ErrorAlert';
import { generateImageFromPrompt } from './services/geminiService';
import { APP_TITLE, DEFAULT_PROMPT, IMAGE_ALT_TEXT } from './constants';

const App: React.FC = () => {
  const [prompt, setPrompt] = useState<string>(DEFAULT_PROMPT);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [reviewNotes, setReviewNotes] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateImage = useCallback(async () => {
    if (!prompt.trim()) {
      setError("Prompt cannot be empty.");
      return;
    }
    setIsLoading(true);
    setError(null);
    setGeneratedImageUrl(null); // Clear previous image

    try {
      const imageUrl = await generateImageFromPrompt(prompt);
      setGeneratedImageUrl(imageUrl);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred while generating the image.");
      }
      console.error("Image generation failed:", err);
    } finally {
      setIsLoading(false);
    }
  }, [prompt]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 text-gray-100 p-4 md:p-8 flex flex-col items-center">
      <header className="w-full max-w-5xl mb-8 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
          {APP_TITLE}
        </h1>
        <p className="text-gray-300 mt-2 text-sm md:text-base">
          Craft stunning, detailed images from your textual descriptions using the power of Imagen.
        </p>
      </header>

      <main className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Input Section */}
        <section className="bg-gray-800 bg-opacity-70 p-6 rounded-xl shadow-2xl backdrop-filter backdrop-blur-lg border border-gray-700">
          <h2 className="text-2xl font-semibold mb-4 text-purple-300">1. Describe Your Image</h2>
          <PromptInput
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., A futuristic city skyline at dusk, neon lights reflecting on wet streets..."
            disabled={isLoading}
          />
          <Button
            onClick={handleGenerateImage}
            disabled={isLoading || !prompt.trim()}
            className="w-full mt-4"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <LoadingSpinner />
                <span className="ml-2">Generating...</span>
              </div>
            ) : (
              "Generate Image"
            )}
          </Button>
          {error && <ErrorAlert message={error} className="mt-4" />}
        </section>

        {/* Output Section */}
        <section className="bg-gray-800 bg-opacity-70 p-6 rounded-xl shadow-2xl backdrop-filter backdrop-blur-lg border border-gray-700">
          <h2 className="text-2xl font-semibold mb-4 text-purple-300">2. Generated Image & Review</h2>
          <ImageDisplay 
            imageUrl={generatedImageUrl} 
            altText={IMAGE_ALT_TEXT}
            isLoading={isLoading} 
          />
          {generatedImageUrl && !isLoading && (
            <div className="mt-6">
              <h3 className="text-xl font-medium mb-2 text-gray-200">3. Review Notes</h3>
              <ReviewNotes
                value={reviewNotes}
                onChange={(e) => setReviewNotes(e.target.value)}
                placeholder="What worked well? What could be improved for the next iteration?"
                disabled={isLoading}
              />
            </div>
          )}
        </section>
      </main>

      <footer className="w-full max-w-5xl mt-12 text-center text-gray-400 text-sm">
        <p>&copy; {new Date().getFullYear()} UltraHD Imagen Generator. Powered by Google Gemini.</p>
      </footer>
    </div>
  );
};

export default App;
    