import { Alert as AlertCore, AlertDescription, AlertIcon, AlertTitle } from "@chakra-ui/react"

export type AlertProps = {
  variant: 'error' | 'success' | 'warning' | 'info';
  title: string;
  description: string;
}

const Alert: React.FC<AlertProps> = ({
  variant,
  title,
  description,
}) => {
  return (
    <AlertCore status={variant}>
      <AlertIcon />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{description}</AlertDescription>
    </AlertCore>
  )
};

export default Alert;