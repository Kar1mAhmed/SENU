const iconUrls = [
  '/Icons/bird.svg',
  '/Icons/columns.svg',
  '/Icons/crown.svg',
  '/Icons/eye.svg',
];

const BackgroundGrid = () => {
  return (
    <div className="fixed inset-0 -z-10 h-full w-full overflow-hidden">
      <div className="relative grid h-full w-full grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, colIndex) => (
          <div
            key={colIndex}
            className={`border-r-2 border-grid ${colIndex >= 2 ? 'hidden md:block' : ''}`}
          >
            <div
              className={`flex h-full flex-col items-center justify-around ${
                colIndex % 2 === 1 ? 'pt-20' : ''
              }`}
            >
              {[...Array(5)].map((_, rowIndex) => {
                const iconUrl = iconUrls[(colIndex + rowIndex) % iconUrls.length];
                return (
                  <div key={rowIndex} className="py-8">
                    <div
                      className="h-8 w-8 bg-white opacity-10"
                      style={{
                        maskImage: `url(${iconUrl})`,
                        WebkitMaskImage: `url(${iconUrl})`,
                        maskSize: 'contain',
                        WebkitMaskSize: 'contain',
                        maskRepeat: 'no-repeat',
                        WebkitMaskRepeat: 'no-repeat',
                      }}
                    ></div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BackgroundGrid;
