import React, { useEffect, useMemo } from "react";
import { 
  Box,
  Button,
  Flex,
  Icon,
  IconButton,
  Input,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  VStack 
} from "@chakra-ui/react";
import { Plus, Trash } from "@phosphor-icons/react";
import { CaptionInput, MemeText } from "../../../../types/meme.types";
import { Opt } from "../../../../types/global.types";

export type MemeCaptionFormSectionProps = {
  texts: MemeText[];
  isDisabled: boolean;
  maxWidth: Opt<number>;
  maxHeight: Opt<number>;
  onCaptionChange: (index: number, key: string, value: string | number) => void;
  onAddCaption: () => void;
  onDeleteCaption: (index: number) => void;
};

const MemeCaptionFormSection: React.FC<MemeCaptionFormSectionProps> = ({ 
  texts,
  isDisabled,
  maxWidth,
  maxHeight,
  onCaptionChange,
  onAddCaption, 
  onDeleteCaption 
}) => {
  const captions: CaptionInput[] = useMemo(() => {
    return texts.map(text => {
      if (!text.ref?.current) {
        return {
          maxWidth: undefined,
          maxHeight: undefined,
        };
      }
      
      const elDim  = text.ref.current.getBoundingClientRect();
      const maxW = maxWidth ? Math.round(maxWidth - elDim.width) : undefined;
      const maxH = maxHeight ? Math.round(maxHeight - elDim.height) : undefined;
      return {
        maxWidth: maxW,
        maxHeight: maxH,
      }
    })
  }, [texts, maxWidth, maxHeight]);

  return (
    <Box p={4} flexGrow={1} height={0} overflowY="auto">
      <VStack>
        {texts.map((text, index) => (
          <Flex width="full" key={`input-caption-${index}`} >
            <Input
              data-testid={`input-caption-content-${index}`}
              value={text.content} mr={1}
              onChange={(event) => onCaptionChange(index, 'content', event.target.value)}
            />
            <NumberInput
              inputMode="numeric"
              value={text.x} 
              maxW={20}
              min={0} 
              max={captions[index].maxWidth} 
              mr={1}
              onChange={(_, value) => onCaptionChange(index, 'x', value)}
            >
              <NumberInputField data-testid={`input-caption-x-${index}`} />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            <NumberInput
              inputMode="numeric"
              value={text.y} 
              maxW={20}
              min={0}
              max={captions[index].maxHeight}
              mr={1}
              onChange={(_, value) => onCaptionChange(index, 'y', value)}
            >
              <NumberInputField data-testid={`input-caption-y-${index}`} />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            <IconButton
              onClick={() => onDeleteCaption(index)}
              aria-label="Delete caption"
              icon={<Icon as={Trash} />}
            />
          </Flex>
        ))}
        <Button
          colorScheme="cyan"
          leftIcon={<Icon as={Plus} />}
          variant="ghost"
          size="sm"
          width="full"
          onClick={onAddCaption}
          isDisabled={isDisabled}
          data-testid="meme-caption-add-button"
        >
          Add a caption
        </Button>
      </VStack>
    </Box>
  )
};

export default MemeCaptionFormSection;