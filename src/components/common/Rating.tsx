import React from "react";
import { Star } from "lucide-react";

interface RatingProps {
  rating: number;
  maxRating?: number;
  size?: number;
  showValue?: boolean;
  className?: string;
}

export const Rating: React.FC<RatingProps> = ({
  rating,
  maxRating = 5,
  size = 20,
  showValue = false,
  className = "",
}) => {
  // Clamp rating between 0 and maxRating
  const clampedRating = Math.max(0, Math.min(rating, maxRating));

  const renderStars = () => {
    const stars = [];

    for (let i = 1; i <= maxRating; i++) {
      const filled = i <= clampedRating;
      const partialFill = i - 1 < clampedRating && i > clampedRating;

      stars.push(
        <div key={i} className="relative inline-block">
          {/* Background star (empty) */}
          <Star size={size} className="text-gray-300" fill="currentColor" />

          {/* Foreground star (filled or partial) */}
          {(filled || partialFill) && (
            <div
              className="absolute top-0 left-0 overflow-hidden"
              style={{
                width: partialFill
                  ? `${(clampedRating - (i - 1)) * 100}%`
                  : "100%",
              }}
            >
              <Star
                size={size}
                className="text-yellow-400"
                fill="currentColor"
              />
            </div>
          )}
        </div>
      );
    }

    return stars;
  };

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <div className="flex">{renderStars()}</div>
      {showValue && (
        <span className="ml-2 text-sm text-gray-600 font-medium">
          {clampedRating.toFixed(1)} / {maxRating}
        </span>
      )}
    </div>
  );
};
