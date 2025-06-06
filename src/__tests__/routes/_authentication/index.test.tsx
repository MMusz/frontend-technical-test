import { act, fireEvent, screen, waitFor } from "@testing-library/react";
import { ChakraProvider } from "@chakra-ui/react";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { AuthenticationContext } from "../../../contexts/authentication";
import { MemeFeedPage } from "../../../routes/_authentication/index";
import { renderWithRouter } from "../../utils";

const scrollToMock = vi.fn(() => {});
vi.stubGlobal('scrollTo', scrollToMock);

describe("routes/_authentication/index", () => {
  describe("MemeFeedPage", () => {
    function renderMemeFeedPage() {
      return renderWithRouter({
        component: MemeFeedPage,
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

    it("should fetch the first page of memes", async () => {
      renderMemeFeedPage();

      await waitFor(() => {
        // We check that the right author's username is displayed
        expect(screen.getByTestId("meme-author-dummy_meme_id_1")).toHaveTextContent('dummy_user_1');
        
        // We check that the right meme's picture is displayed
        expect(screen.getByTestId("meme-picture-dummy_meme_id_1")).toHaveStyle({
          'background-image': 'url("https://dummy.url/meme/1")',
        });

        // We check that the right texts are displayed at the right positions
        const text1 = screen.getByTestId("meme-picture-dummy_meme_id_1-text-0");
        const text2 = screen.getByTestId("meme-picture-dummy_meme_id_1-text-1");
        expect(text1).toHaveTextContent('dummy text 1');
        expect(text1).toHaveStyle({
          'top': '0px',
          'left': '0px',
        });
        expect(text2).toHaveTextContent('dummy text 2');
        expect(text2).toHaveStyle({
          'top': '100px',
          'left': '100px',
        });

        // We check that the right description is displayed
        expect(screen.getByTestId("meme-description-dummy_meme_id_1")).toHaveTextContent('dummy meme 1');
        
        // We check that the right number of comments is displayed
        expect(screen.getByTestId("meme-comments-count-dummy_meme_id_1")).toHaveTextContent('3 comments');
      });
    });

    it("should fetch more memes after clicking on load more button", async () => {
      renderMemeFeedPage();

      await waitFor(() => {
        // We wait for the memes to be load
        expect(screen.getByTestId("meme-comments-section-dummy_meme_id_1")).toBeInTheDocument();
      });

      act(() => {
        // We click on load more memes
        const button = screen.getByTestId("meme-load-more-button");
        fireEvent.click(button);
      });

      await waitFor(() => {
        // We check that the right author's username is displayed
        expect(screen.getByTestId("meme-author-dummy_meme_id_2")).toHaveTextContent('dummy_user_2');
        
        // We check that the right meme's picture is displayed
        expect(screen.getByTestId("meme-picture-dummy_meme_id_2")).toHaveStyle({
          'background-image': 'url("https://dummy.url/meme/2")',
        });

        // We check that the right texts are displayed at the right positions
        const text1 = screen.getByTestId("meme-picture-dummy_meme_id_2-text-0");
        const text2 = screen.getByTestId("meme-picture-dummy_meme_id_2-text-1");
        expect(text1).toHaveTextContent('dummy text 1');
        expect(text1).toHaveStyle({
          'top': '0px',
          'left': '0px',
        });
        expect(text2).toHaveTextContent('dummy text 2');
        expect(text2).toHaveStyle({
          'top': '100px',
          'left': '100px',
        });

        // We check that the right description is displayed
        expect(screen.getByTestId("meme-description-dummy_meme_id_2")).toHaveTextContent('dummy meme 2');
        
        // We check that the right number of comments is displayed
        expect(screen.getByTestId("meme-comments-count-dummy_meme_id_2")).toHaveTextContent('2 comments');
      });
    });

    it("should fetch the first page of comments on collapsing comment section", async () => {
      renderMemeFeedPage();

      await waitFor(() => {
        // We wait for the memes to be load
        expect(screen.getByTestId("meme-comments-section-dummy_meme_id_1")).toBeInTheDocument();
      });

      act(() => {
        // We collapse the comment section to trigger the load of comment
        const collapseLink = screen.getByTestId("meme-comments-section-dummy_meme_id_1");
        fireEvent.click(collapseLink);
      });

      await waitFor(() => {
        // We check that the right comments with the right authors are displayed
        expect(screen.getByTestId("meme-comment-content-dummy_meme_id_1-dummy_comment_id_1")).toHaveTextContent('dummy comment 1');
        expect(screen.getByTestId("meme-comment-author-dummy_meme_id_1-dummy_comment_id_1")).toHaveTextContent('dummy_user_1');

        expect(screen.getByTestId("meme-comment-content-dummy_meme_id_1-dummy_comment_id_2")).toHaveTextContent('dummy comment 2');
        expect(screen.getByTestId("meme-comment-author-dummy_meme_id_1-dummy_comment_id_2")).toHaveTextContent('dummy_user_2');
        
        expect(screen.getByTestId("meme-comment-content-dummy_meme_id_1-dummy_comment_id_3")).toHaveTextContent('dummy comment 3');
        expect(screen.getByTestId("meme-comment-author-dummy_meme_id_1-dummy_comment_id_3")).toHaveTextContent('dummy_user_3');
      });
    });
    
    it("should show comment right after it has been posted", async () => {
      renderMemeFeedPage();

      await waitFor(() => {
        // We wait for the memes to be load
        expect(screen.getByTestId("meme-comments-section-dummy_meme_id_1")).toBeInTheDocument();
      });

      act(() => {
        // We collapse the comment section to be able to post a comment
        const collapseLink = screen.getByTestId("meme-comments-section-dummy_meme_id_1");
        fireEvent.click(collapseLink);
      });

      await waitFor(() => {
        // We wait for the form to be displayed
        expect(screen.getByTestId("meme-comments-section-form-dummy_meme_id_1")).toBeInTheDocument();

        // We check the current comment count
        expect(screen.getByTestId("meme-comments-count-dummy_meme_id_1")).toHaveTextContent('3 comments');
      });

      act(() => {
        // We act as if we fill the comment form and posting it
        const input = screen.getByTestId('meme-comments-section-form-dummy_meme_id_1-input');
        const form = screen.getByTestId('meme-comments-section-form-dummy_meme_id_1');
        fireEvent.change(input, { target: { value: 'dummy comment 4' } });
        fireEvent.submit(form);
      });

      await waitFor(() => {
        // We check that the new comment is well displayed
        expect(screen.getByTestId("meme-comment-content-dummy_meme_id_1-dummy_comment_id_4")).toHaveTextContent('dummy comment 4');

        // We check that the comment count has been increased
        expect(screen.getByTestId("meme-comments-count-dummy_meme_id_1")).toHaveTextContent('4 comments');
      });
    });
  });
});
