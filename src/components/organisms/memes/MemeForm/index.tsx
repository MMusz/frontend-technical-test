import { useMemo, useState } from "react";
import { Box, Button, Flex, Heading, HStack, Textarea, VStack } from "@chakra-ui/react";
import { BadRequestError, UnauthorizedError } from "../../../../services/api.service";
import { Nullable, Opt } from "../../../../types/global.types";
import { CompleteMemePicture, MemeText, Picture, PictureDimension, PostMemeApiRequestData } from "../../../../types/meme.types";
import Alert from "../../../atoms/Alert";
import MemeCaptionFormSection from "../../../molecules/memes/MemeCaptionFormSection";
import MemeDropzoneFormSection from "../../../molecules/memes/MemeDropzoneFormSection";
import React from "react";

export type MemeFormProps = {
  dataTestId: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error: Nullable<UnauthorizedError | BadRequestError | any>
  onCancel: () => void;
  onSubmit: (data: PostMemeApiRequestData) => void;
};

const MemeForm: React.FC<MemeFormProps> = ({
  dataTestId,
  error,
  onSubmit,
  onCancel,
}) => {
  const [picture, setPicture] = useState<Nullable<Picture>>(null);
  const [pictureDim, setPictureDim] = useState<Nullable<PictureDimension>>(null);
  const [texts, setTexts] = useState<MemeText[]>([]);
  const [description, setDescription] = useState<string>('');

  const handleDrop = (file: File) => {
    setPicture({
      url: URL.createObjectURL(file),
      file,
    });
  };

  const handleDescriptionChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(event.target.value);
  };

  const handleCaptionChange = (index: number, key: string, value: string | number) => {
    setTexts(texts.map((text: MemeText, idx: number) => {
      return idx === index
        ? {
          ...text,
          [key]: value
        }
        : text;
    }));
  };

  const handleAddCaption = () => {
    setTexts([
      ...texts,
      {
        content: `New caption ${texts.length + 1}`,
        x: Math.ceil(Math.random() * 400),
        y: Math.ceil(Math.random() * 225),
        ref: React.createRef()
      },
    ]);
  };

  const handleDeleteCaption = (index: number) => {
    setTexts(texts.filter((_, i) => i !== index));
  };

  const handlePictureDimensionChange = (dim: PictureDimension) => {
    setPictureDim({
      height: dim.height,
      width: dim.width,
    });
  };

  const memePicture = useMemo<Opt<CompleteMemePicture>>(() => {
    if (!picture) {
      return undefined;
    }

    return {
      dataTestId: `meme-dropzone-picture-${picture.url}`,
      pictureUrl: picture.url,
      picture: picture.file,
      description,
      texts,
    };
  }, [picture, texts, description]);
  
  const handleSubmit = () => {
    if (memePicture) {
      onSubmit(memePicture);
    }
  };

  return (
    <Flex width="full" height="full" data-testid={dataTestId}>
      <Box flexGrow={1} height="full" p={4} overflowY="auto">
        <VStack spacing={5} align="stretch">
          {error !== null && (
            <Box>
              <Alert
                dataTestId='meme-form-alert'
                variant={error instanceof BadRequestError ? "error" : "warning"}
                title="Oops!" 
                description={
                  error instanceof BadRequestError 
                    ? "Something wrong with you meme, check your form and try again!" 
                    : "An error occured, try again later"
                } 
              />
            </Box>
          )}
          <Box>
            <Heading as="h2" size="md" mb={2}>
              Upload your picture
            </Heading>
            <MemeDropzoneFormSection 
              onDrop={handleDrop}
              memePicture={memePicture}
              onPictureDimensionChange={handlePictureDimensionChange}
            />
          </Box>
          <Box>
            <Heading as="h2" size="md" mb={2}>
              Describe your meme
            </Heading>
            <Textarea 
              placeholder="Type your description here..." 
              onChange={(event) => handleDescriptionChange(event)}
              data-testid='meme-input-description'
            />
          </Box>
        </VStack>
      </Box>
      <Flex
        flexDir="column"
        width="30%"
        minW="250"
        height="full"
        boxShadow="lg"
      >
        <Heading as="h2" size="md" mb={2} p={4}>
          Add your captions
        </Heading>
        <MemeCaptionFormSection 
          texts={texts} 
          isDisabled={memePicture === undefined}
          maxWidth={pictureDim?.width}
          maxHeight={pictureDim?.height}
          onCaptionChange={handleCaptionChange}
          onAddCaption={handleAddCaption}
          onDeleteCaption={handleDeleteCaption}
        />
        <HStack p={4}>
          <Button
            onClick={() => onCancel()}
            colorScheme="cyan"
            variant="outline"
            size="sm"
            width="full"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            colorScheme="cyan"
            size="sm"
            width="full"
            color="white"
            isDisabled={memePicture === undefined}
            onClick={() => handleSubmit()}
          >
            Submit
          </Button>
        </HStack>
      </Flex>
    </Flex>
  );
};

export default MemeForm;