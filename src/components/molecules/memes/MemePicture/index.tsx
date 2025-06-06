import { useMemo, useRef } from "react";
import { Box, Text, useDimensions } from "@chakra-ui/react";
import { MemeText } from "../../../../types/meme.types";
import { REF_FONT_SIZE, REF_HEIGHT, REF_WIDTH } from "../../../../constants/meme.constants";

export type MemePictureProps = {
  pictureUrl: string;
  texts: MemeText[];
  dataTestId?: string;
};

const MemePicture: React.FC<MemePictureProps> = ({
  pictureUrl,
  texts: rawTexts,
  dataTestId = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const dimensions = useDimensions(containerRef, true);
  const boxWidth = dimensions?.borderBox.width;

  const { height, fontSize, texts } = useMemo(() => {
    if (!boxWidth) {
      return { height: 0, fontSize: 0, texts: rawTexts };
    }

    return {
      height: (boxWidth / REF_WIDTH) * REF_HEIGHT,
      fontSize: (boxWidth / REF_WIDTH) * REF_FONT_SIZE,
      texts: rawTexts.map((text) => ({
        ...text,
        x: (boxWidth / REF_WIDTH) * text.x,
        y: (boxWidth / REF_WIDTH) * text.y,
      })),
    };
  }, [boxWidth, rawTexts]);

  return (
    <Box
      width="full"
      height={height}
      ref={containerRef}
      backgroundImage={pictureUrl}
      backgroundColor="gray.100"
      backgroundPosition="center"
      backgroundRepeat="no-repeat"
      backgroundSize="contain"
      overflow="hidden"
      position="relative"
      borderRadius={8}
      data-testid={dataTestId}
    >
      {texts.map((text, index) => (
        <Text
          key={index}
          position="absolute"
          left={text.x}
          top={text.y}
          fontSize={fontSize}
          color="white"
          fontFamily="Impact"
          fontWeight="bold"
          userSelect="none"
          textTransform="uppercase"
          style={{ WebkitTextStroke: "1px black" }}
          data-testid={`${dataTestId}-text-${index}`}
        >
          {text.content}
        </Text>
      ))}
    </Box>
  );
};

export default MemePicture;