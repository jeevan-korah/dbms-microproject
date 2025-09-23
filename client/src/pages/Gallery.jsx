import { useEffect, useState, useCallback, useRef } from "react";
import { useLocation } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroll-component";

const accessKey = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;

const Gallery = () => {
  const location = useLocation();
  const [galleryImages, setGalleryImages] = useState([]);
  const [pageIndex, setPageIndex] = useState(1);
  const [query, setQuery] = useState("");
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [columns, setColumns] = useState(4);
  const containerRef = useRef(null);

  // Responsive column count
  useEffect(() => {
    const updateColumns = () => {
      const width = window.innerWidth;
      if (width < 640) setColumns(1);
      else if (width < 768) setColumns(2);
      else if (width < 1024) setColumns(3);
      else setColumns(4);
    };

    updateColumns();
    window.addEventListener("resize", updateColumns);
    return () => window.removeEventListener("resize", updateColumns);
  }, []);

  // Extract query from URL and reset state when query changes
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const queryTerm = urlParams.get("query") || "";

    if (queryTerm !== query) {
      setQuery(queryTerm);
      setGalleryImages([]);
      setPageIndex(1);
      setIsInitialLoad(true);
    }
  }, [location.search, query]);

  const getPhotos = useCallback(() => {
    if (!accessKey) return;

    let apiLink = `https://api.unsplash.com/`;

    if (query) {
      apiLink += `search/photos?page=${pageIndex}&client_id=${accessKey}&query=${query}&per_page=12`;
    } else {
      apiLink += `photos?page=${pageIndex}&client_id=${accessKey}&per_page=12`;
    }

    fetch(apiLink)
      .then((res) => res.json())
      .then((data) => {
        const results = query ? data.results : data;

        setGalleryImages((prev) => {
          if (isInitialLoad || pageIndex === 1) {
            setIsInitialLoad(false);
            return results;
          }
          return [...prev, ...results];
        });
      })
      .catch((err) => console.error("Error fetching photos:", err));
  }, [pageIndex, query, isInitialLoad]);

  useEffect(() => {
    if (query !== undefined) {
      getPhotos();
    }
  }, [query, pageIndex]);

  useEffect(() => {
    if (!isInitialLoad && query !== undefined) {
      setPageIndex(1);
    }
  }, [query, isInitialLoad]);

  // Create column arrays for masonry layout
  const createColumns = () => {
    const cols = Array.from({ length: columns }, () => []);

    galleryImages.forEach((image, index) => {
      const columnIndex = index % columns;
      cols[columnIndex].push(image);
    });

    return cols;
  };

  if (!accessKey) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center">
        <a
          href="https://unsplash.com/developers"
          className="text-red-500 font-medium underline"
        >
          Please get your Unsplash API key and set it in .env as
          VITE_UNSPLASH_ACCESS_KEY
        </a>
      </div>
    );
  }

  const columnArrays = createColumns();

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Gallery: {query || "All Photos"}
      </h1>

      <InfiniteScroll
        dataLength={galleryImages.length}
        next={() => setPageIndex((prev) => prev + 1)}
        hasMore={true}
        loader={<h4 className="text-center mt-4">Loading More...</h4>}
      >
        <div
          ref={containerRef}
          className="flex gap-4"
          style={{ alignItems: "flex-start" }}
        >
          {columnArrays.map((column, columnIndex) => (
            <div key={columnIndex} className="flex-1 flex flex-col gap-4">
              {column.map((image) => (
                <div key={`${query}-${image.id}`} className="w-full">
                  <a
                    href={image.links.html}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <img
                      src={image.urls.small}
                      alt={image.alt_description}
                      className="w-full rounded-2xl transition-transform duration-300 hover:scale-[1.02] shadow-lg"
                      loading="lazy"
                      style={{
                        display: "block",
                        height: "auto",
                      }}
                    />
                  </a>
                </div>
              ))}
            </div>
          ))}
        </div>
      </InfiniteScroll>

      <p className="text-center mt-6 text-gray-500">
        Loaded {galleryImages.length} images so far!
      </p>
    </div>
  );
};

export default Gallery;
