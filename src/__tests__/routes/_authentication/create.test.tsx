import { ChakraProvider } from "@chakra-ui/react";
import { QueryClient,QueryClientProvider } from "@tanstack/react-query";
import { act, fireEvent, screen, waitFor } from "@testing-library/react";
import { AuthenticationContext } from "../../../contexts/authentication";
import { CreateMemePage } from "../../../routes/_authentication/create";
import { renderWithRouter } from "../../utils";

function mockData(files: File[]) {
  return {
    dataTransfer: {
      files,
      items: files.map((file) => ({
        kind: 'file',
        type: file.type,
        getAsFile: () => file,
      })),
      types: ['Files'],
    },
  };
}

async function uploadPictureAndAddCaption() {
  await act(() => {
    // We drop a file on the drop zone
    const dropzone = screen.getByTestId('meme-dropzone');
    const file = new File(['(⌐□_□)'], 'image-test.png', { type: 'image/png' })
    fireEvent.drop(dropzone, mockData([file]))
  });

  await waitFor(() => {
    // We check the picture is loaded
    expect(screen.getByTestId('meme-dropzone-picture-blob:mocked-url')).toBeInTheDocument();
  });

  act(() => {
    // We add captions
    const buttonAdd = screen.getByTestId('meme-caption-add-button');
    fireEvent.click(buttonAdd)
  });

  // We check caption is added
  expect(screen.getByTestId('input-caption-content-0')).toHaveValue('New caption 1');
  expect(screen.getByTestId('input-caption-x-0')).toBeInTheDocument();
  expect(screen.getByTestId('input-caption-y-0')).toBeInTheDocument();
}

describe("routes/_authentication/create", () => {
  describe("CreateMemePage", () => {
    function renderCreateMemePage() {
      return renderWithRouter({
        currentUrl: '/create',
        component: CreateMemePage,
        Wrapper: ({ children }) => (
          <ChakraProvider>
            <QueryClientProvider client={new QueryClient()}>
              <AuthenticationContext.Provider
                value={{
                  state: {
                    isAuthenticated: true,
                    userId: "dummy_user_id_1",
                    token: "dummy_token",
                  },
                  authenticate: () => {},
                  signout: () => {},
                }}
              >
                {children}
              </AuthenticationContext.Provider>
            </QueryClientProvider>
          </ChakraProvider>
        ),
      });
    }

    it("should redirect to feed on cancel click", async () => {
      const { router } = renderCreateMemePage();

      await waitFor(() => {
        // We wait for the form to be displayed
        expect(screen.getByTestId("meme-form")).toBeInTheDocument();
      });

      act(() => {
        // we click on cancel button
        const buttonCancel = screen.getByText('Cancel');
        fireEvent.click(buttonCancel);
      });

      await waitFor(() => {
        expect(router.state.location.pathname).toBe('/');
      });
    });

    it("should redirect to feed after create a meme", async () => {
      const { router } = renderCreateMemePage();

      await waitFor(() => {
        // We wait for the form to be displayed
        expect(screen.getByTestId("meme-form")).toBeInTheDocument();
      });

      await act(() => {
        // We drop a file on the drop zone
        const dropzone = screen.getByTestId('meme-dropzone');
        const file = new File(['(⌐□_□)'], 'image-test.png', { type: 'image/png' })
        fireEvent.drop(dropzone, mockData([file]))
      });

      await waitFor(() => {
        // We check the picture is loaded
        expect(screen.getByTestId('meme-dropzone-picture-blob:mocked-url')).toBeInTheDocument();
      });

      act(() => {
        // We add captions
        const buttonAdd = screen.getByTestId('meme-caption-add-button');
        fireEvent.click(buttonAdd)
      });
      
      // We check caption is added
      const inputContent = screen.getByTestId('input-caption-content-0');
      const inputX = screen.getByTestId('input-caption-x-0');
      const inputY = screen.getByTestId('input-caption-y-0');
      expect(inputContent).toHaveValue('New caption 1');
      expect(inputX).toBeInTheDocument();
      expect(inputY).toBeInTheDocument();

      act(() => {
        // We change caption content and postion
        fireEvent.change(inputContent, { target: { value: 'Test content 1' }});
        fireEvent.change(inputX, { target: { value: 100 }});
        fireEvent.change(inputY, { target: { value: 150 }});
      });

      expect(inputContent).toHaveValue('Test content 1');
      expect(inputX).toHaveValue('100');
      expect(inputY).toHaveValue('150');

      const inputDescription = screen.getByTestId('meme-input-description');
      act(() => {
        // We change meme description
        fireEvent.change(inputDescription, { target: { value: 'valid description' }});
      });

      expect(inputDescription).toHaveValue('valid description');

      await act(async () => {
        // we submit form
        const buttonSubmit = screen.getByText('Submit');
        fireEvent.click(buttonSubmit);
      })

      await waitFor(() => {
        expect(router.state.location.pathname).toBe('/');
      })
    });

    it.skip("should show an error message on When API respond with a 400 error", async () => {
      renderCreateMemePage();

      await waitFor(() => {
        // We wait for the form to be displayed
        expect(screen.getByTestId("meme-form")).toBeInTheDocument();
      });

      await uploadPictureAndAddCaption();

      const inputDescription = screen.getByTestId('meme-input-description');
      act(() => {
        // We change meme description
        fireEvent.change(inputDescription, { target: { value: 'error_user' }});
      });

      expect(inputDescription).toHaveValue('error_user');

      act(() => {
        // we submit form
        const buttonSubmit = screen.getByText('Submit');
        fireEvent.click(buttonSubmit);
      })

      
      await waitFor(() => {
        // we check that the alert message is present
        const alert = screen.getByTestId('meme-form-alert');
        expect(alert).toBeInTheDocument();
        expect(screen.getByTestId('meme-form-alert-description')).toHaveTextContent('Something wrong with you meme, check your form and try again!');
      })
    });

    it.skip("should show an error message for any other error", async () => {
      renderCreateMemePage();

      await waitFor(() => {
        // We wait for the form to be displayed
        expect(screen.getByTestId("meme-form")).toBeInTheDocument();
      });

      await uploadPictureAndAddCaption();

      const inputDescription = screen.getByTestId('meme-input-description');
      act(() => {
        // We change meme description
        fireEvent.change(inputDescription, { target: { value: 'error_server' }});
      });

      expect(inputDescription).toHaveValue('error_server');

      act(() => {
        // we submit form
        const buttonSubmit = screen.getByText('Submit');
        fireEvent.click(buttonSubmit);
      })
      
      await waitFor(() => {
        // we check that the alert message is present
        const alert = screen.getByTestId('meme-form-alert');
        expect(alert).toBeInTheDocument();
        expect(screen.getByTestId('meme-form-alert-description')).toHaveTextContent('An error occured, try again later');
      })
    });
  });
});
