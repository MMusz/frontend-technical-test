import { Alert as AlertCore, AlertDescription, AlertIcon, AlertTitle } from "@chakra-ui/react"

export type AlertProps = {
  variant: 'error' | 'success' | 'warning' | 'info';
  title: string;
  description: string;
  dataTestId?: string;
}

const Alert: React.FC<AlertProps> = ({
  variant,
  title,
  description,
  dataTestId,
}) => {
  return (
    <AlertCore status={variant} data-testid={dataTestId}>
      <AlertIcon />
      <AlertTitle data-testid={`${dataTestId}-title`}>{title}</AlertTitle>
      <AlertDescription data-testid={`${dataTestId}-description`}>{description}</AlertDescription>
    </AlertCore>
  )
};

export default Alert;