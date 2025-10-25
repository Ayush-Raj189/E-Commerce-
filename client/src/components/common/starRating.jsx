import React from "react"
import { StarIcon } from "lucide-react"
import { Button } from "../ui/button"

function StarRatingComponent({ rating, handleRatingChange }) {
  return (
    <div className="flex items-center gap-1 sm:gap-2">
      {[1, 2, 3, 4, 5].map((star) => (
        <Button
          key={star}
          className={`p-1.5 sm:p-2 rounded-full transition-all duration-300 ${
            star <= rating
              ? "text-yellow-500 bg-yellow-50 hover:bg-yellow-100 dark:bg-yellow-500/10 dark:hover:bg-yellow-500/20 border-yellow-200"
              : "text-muted-foreground bg-background hover:bg-muted border-border"
          }`}
          variant="outline"
          size="icon"
          onClick={handleRatingChange ? () => handleRatingChange(star) : null}
          disabled={!handleRatingChange}
          aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
        >
          <StarIcon
            className={`w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 transition-all ${
              star <= rating 
                ? "fill-yellow-500 stroke-yellow-600" 
                : "fill-muted stroke-muted-foreground"
            }`}
          />
        </Button>
      ))}
    </div>
  )
}

export default StarRatingComponent
