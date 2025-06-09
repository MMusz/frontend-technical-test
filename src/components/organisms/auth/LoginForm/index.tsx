import React from "react"
import { Button, Flex, FormControl, FormLabel, Heading, Input, Text, FormErrorMessage } from "@chakra-ui/react";
import { SubmitHandler, useForm } from "react-hook-form";
import { BadRequestError, UnauthorizedError } from "../../../../services/api.service";
import { Nullable } from "../../../../types/global.types";
import { LoginRequestData } from "../../../../types/auth.types";

export type LoginFormProps = {
  error: Nullable<BadRequestError | UnauthorizedError | Error>;
  isLoading: boolean;
  onSubmit: SubmitHandler<LoginRequestData>;
};

const LoginForm: React.FC<LoginFormProps> = ({
  error,
  isLoading,
  onSubmit,
}) => {
  const { register, handleSubmit } = useForm<LoginRequestData>();
  return (
    <Flex
      height="full"
      width="full"
      alignItems="center"
      justifyContent="center"
    >
      <Flex
        direction="column"
        bgGradient="linear(to-br, cyan.100, cyan.200)"
        p={8}
        borderRadius={16}
      >
        <Heading as="h2" size="md" textAlign="center" mb={4}>
          Login
        </Heading>
        <Text textAlign="center" mb={4}>
          Welcome back! 👋
          <br />
          Please enter your credentials.
        </Text>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormControl>
            <FormLabel>Username</FormLabel>
            <Input
              type="text"
              placeholder="Enter your username"
              bg="white"
              size="sm"
              {...register("username")}
            />
          </FormControl>
          <FormControl isInvalid={error !== null}>
            <FormLabel>Password</FormLabel>
            <Input
              type="password"
              placeholder="Enter your password"
              bg="white"
              size="sm"
              {...register("password")}
            />
            {error && (
              <FormErrorMessage>
                {error instanceof UnauthorizedError 
                  ? 'Wrong credentials' 
                  : 'An unknown error occured, please try again later'
                }
              </FormErrorMessage>
            )}
          </FormControl>
          <Button
            color="white"
            colorScheme="cyan"
            mt={4}
            size="sm"
            type="submit"
            width="full"
            isLoading={isLoading}
          >
            Login
          </Button>
        </form>
      </Flex>
    </Flex>
  )
};

export default LoginForm;