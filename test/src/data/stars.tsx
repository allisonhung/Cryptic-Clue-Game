import { Devvit , useState} from "@devvit/public-api";

type StarRatingProps = {
    rating: number;
    onRatingSelected: (rating: number) => void;
};

export const StarRating = (props: StarRatingProps): JSX.Element => {
    const [rating, setRating] = useState<number>(props.rating);
    const handleRatingChange = (star: number) => {
        setRating(star);
        props.onRatingSelected(star);
    }

    return(
        <hstack alignment = "center middle">
            {[1, 2, 3, 4, 5].map((star) => (
            <icon
              name={star <= rating ? "star-fill" : "star"}
              color={star <= rating ? "yellow" : "neutral"}
              size="large"
              onPress={() => handleRatingChange(star)}
            />
          ))}
        </hstack>
    )
};

type StarDisplayProps = {
    rating: number;
}; 
