// const Text = ({ text, variant }: { text: String, variant: "primary" | "secondary" }) => {
//    let styles = ""

//    switch (variant) {
//       case "primary":
//          styles += " text-foreground text-xs sm:text-sm lg:text-medium"
//          break;
//       case "secondary":
//          styles += " text-foreground-400 text-xs sm:text-sm"
//    }

//    return <p className={styles}>{text}</p>
// }
// export default Text
import React from 'react';

interface TextProps {
  text: string;
  variant: "primary" | "secondary";
}

const Text: React.FC<TextProps> = ({ text, variant }) => {
  let styles = "text-xs sm:text-sm"; // common base styles

  switch (variant) {
    case "primary":
      styles += " text-foreground lg:text-medium";
      break;
    case "secondary":
      styles += " text-foreground-400";
      break;
    default:
      // Optionally handle an unknown variant or fallback to a default variant
      styles += " text-foreground";
  }

  return <p className={styles}>{text}</p>;
};

export default Text;
