import { ZoomIn } from 'lucide-react';
import { useState } from 'react';
import { PageLayout } from './common/PageLayout';
import { LAYOUT, ANIMATIONS, TYPOGRAPHY } from '../constants';
import { galleryImages } from '../data/gallery';

export function GalleryPage() {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  return (
    <PageLayout showBackButton backLabel="Back to Home">
      <div className="mb-12">
        <h1 className={`${TYPOGRAPHY.HEADING.H1} ${TYPOGRAPHY.COLOR.PRIMARY} mb-4`}>
          Gallery
        </h1>
        <p className={`${TYPOGRAPHY.BODY.LG} text-muted-foreground`}>
          A showcase of my artwork, character designs, and environment pieces
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {galleryImages.map((item, index) => (
          <div
            key={index}
            className="group relative cursor-pointer"
            onClick={() => setSelectedImage(index)}
          >
            <div className={`
              relative overflow-hidden ${LAYOUT.RADIUS.MD}
              bg-card border border-border hover:border-accent
              ${ANIMATIONS.TRANSITION.ALL} ${ANIMATIONS.DURATION_CLASS.NORMAL}
            `}>
              <div className="aspect-square relative">
                <img
                  src={item.url}
                  alt={item.title}
                  className={`w-full h-full object-cover ${ANIMATIONS.HOVER.SCALE} ${ANIMATIONS.TRANSITION.TRANSFORM} ${ANIMATIONS.DURATION_CLASS.SLOW}`}
                  loading={index < 3 ? 'eager' : 'lazy'}
                  fetchPriority={index < 3 ? 'high' : undefined}
                />
                <div className={`
                  absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent
                  opacity-0 group-hover:opacity-100
                  ${ANIMATIONS.TRANSITION.OPACITY} ${ANIMATIONS.DURATION_CLASS.NORMAL}
                `}></div>

                <div className={`
                  absolute inset-0 flex items-center justify-center
                  opacity-0 group-hover:opacity-100
                  ${ANIMATIONS.TRANSITION.OPACITY} ${ANIMATIONS.DURATION_CLASS.NORMAL}
                `}>
                  <div className="p-3 bg-accent rounded-full">
                    <ZoomIn className="w-6 h-6 text-white" />
                  </div>
                </div>

                <div className={`
                  absolute bottom-0 left-0 right-0 p-4
                  translate-y-full group-hover:translate-y-0
                  ${ANIMATIONS.TRANSITION.TRANSFORM} ${ANIMATIONS.DURATION_CLASS.NORMAL}
                `}>
                  <h3 className="text-white font-semibold mb-1">{item.title}</h3>
                  <span className="text-sm text-accent">{item.category}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedImage !== null && (
        <div
          className="fixed inset-0 bg-black/90 flex items-center justify-center p-4"
          style={{ zIndex: LAYOUT.Z_INDEX.LIGHTBOX }}
          onClick={() => setSelectedImage(null)}
        >
          <button
            className="absolute top-4 right-4 text-white hover:text-accent text-4xl"
            onClick={() => setSelectedImage(null)}
          >
            ×
          </button>
          <div className="max-w-6xl max-h-[90vh] flex flex-col items-center gap-4">
            <img
              src={galleryImages[selectedImage].url}
              alt={galleryImages[selectedImage].title}
              className={`max-w-full max-h-[80vh] object-contain ${LAYOUT.RADIUS.MD}`}
            />
            <div className="text-center">
              <h3 className={`${TYPOGRAPHY.HEADING.H3} text-white mb-2`}>
                {galleryImages[selectedImage].title}
              </h3>
              <span className="text-accent">
                {galleryImages[selectedImage].category}
              </span>
            </div>
          </div>
        </div>
      )}
    </PageLayout>
  );
}
