import { createFileRoute, useNavigate } from "@tanstack/react-router";
import MemeForm from "../../components/organisms/memes/MemeForm";
import { usePostMeme } from "../../hooks/features/use-memes";
import { PostMemeApiRequestData } from "../../types/meme.types";
import { useEffect } from "react";

export const CreateMemePage: React.FC = () => {
  const navigate = useNavigate()
  const { isSuccess, error, mutate: postMeme } = usePostMeme();

  const handleCancel = () => {
    navigate({ to: '/' });
  };

  const handleSubmitForm = (data: PostMemeApiRequestData) => {
    postMeme(data);
  };

  useEffect(() => {
    if (isSuccess) {
      navigate({ to: '/' });
    }
  }, [isSuccess, navigate]);
  
  return (
    <MemeForm
      dataTestId="meme-form"
      error={error}
      onCancel={handleCancel}
      onSubmit={handleSubmitForm}
    />
  )
};

export const Route = createFileRoute("/_authentication/create")({
  component: CreateMemePage,
});