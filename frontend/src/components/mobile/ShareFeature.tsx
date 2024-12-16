export const ShareButton: React.FC<{ artworkId: string; title: string }> = ({ 
  artworkId, 
  title 
}) => {
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Check out my protected artwork on ArtGuard',
          text: `View "${title}" on ArtGuard`,
          url: `https://artguard.app/artwork/${artworkId}`
        });
      } catch (err) {
        console.log('Share failed:', err);
      }
    } else {
      // Fallback for browsers that don't support native sharing
      const url = `https://artguard.app/artwork/${artworkId}`;
      navigator.clipboard.writeText(url);
      // Show toast notification
    }
  };

  return (
    <button
      onClick={handleShare}
      className="p-2 rounded-full bg-neon-blue text-white shadow-lg
                 hover:bg-blue-600 transition-colors"
    >
      <Share className="w-5 h-5" />
    </button>
  );
};

