import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Review } from "@/types";

interface ProductTabsProps {
  description: string;
  reviews?: Review[];
}

export function ProductTabs({ description, reviews }: ProductTabsProps) {
  const reviewCount = Array.isArray(reviews) ? reviews.length : 0;

  return (
    <div className="w-full">
      <Tabs defaultValue="description" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-md bg-foreground">
          <TabsTrigger value="description" className="text-background">
            Description
          </TabsTrigger>
          <TabsTrigger value="reviews" className="text-background">
            Reviews ({reviewCount})
          </TabsTrigger>
        </TabsList>
        <TabsContent value="description" className="mt-8">
          <div className="prose prose-gray max-w-none">
            <p className="text-foreground leading-relaxed text-justify">
              {description}
            </p>
          </div>
        </TabsContent>
        <TabsContent value="reviews" className="mt-8">
          <div className="text-foreground">
            {reviewCount === 0 || !reviews ? (
              <p>No reviews yet. Be the first to review this product!</p>
            ) : (
              <div className="space-y-4">
                {reviews.map((review, index) => (
                  <div
                    key={index}
                    className="border-b border-primary pb-4 last:border-b-0"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">
                        {review.name || "Anonymous"}
                      </h4>
                      <span className="text-sm text-gray-500">
                        {review.date}
                      </span>
                    </div>
                    {review.rating && (
                      <div className="flex items-center mb-2">
                        <span className="text-yellow-500">
                          {"★".repeat(review.rating)}
                          {"☆".repeat(5 - review.rating)}
                        </span>
                      </div>
                    )}
                    <p className="text-primary">{review.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
