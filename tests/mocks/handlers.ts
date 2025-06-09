import { http, HttpResponse } from "msw";

const baseUrl = 'https://fetestapi.int.mozzaik365.net/api';

const users = [
  {
    id: "dummy_user_id_1",
    username: "dummy_user_1",
    pictureUrl: "https://dummy.url/1",
  },
  {
    id: "dummy_user_id_2",
    username: "dummy_user_2",
    pictureUrl: "https://dummy.url/2",
  },
  {
    id: "dummy_user_id_3",
    username: "dummy_user_3",
    pictureUrl: "https://dummy.url/3",
  },
];

const memes = [
  {
    id: "dummy_meme_id_1",
    authorId: "dummy_user_id_1",
    pictureUrl: "https://dummy.url/meme/1",
    description: "dummy meme 1",
    commentsCount: 3,
    texts: [
      { content: "dummy text 1", x: 0, y: 0 },
      { content: "dummy text 2", x: 100, y: 100 },
    ],
    createdAt: "2021-09-01T12:00:00Z",
  },
  {
    id: "dummy_meme_id_2",
    authorId: "dummy_user_id_2",
    pictureUrl: "https://dummy.url/meme/2",
    description: "dummy meme 2",
    commentsCount: 2,
    texts: [
      { content: "dummy text 1", x: 0, y: 0 },
      { content: "dummy text 2", x: 100, y: 100 },
    ],
    createdAt: "2021-09-01T12:00:00Z",
  },
]

const comments = [
  {
    id: "dummy_comment_id_1",
    memeId: "dummy_meme_id_1",
    authorId: "dummy_user_id_1",
    content: "dummy comment 1",
    createdAt: "2021-09-01T12:00:00Z",
  },
  {
    id: "dummy_comment_id_2",
    memeId: "dummy_meme_id_1",
    authorId: "dummy_user_id_2",
    content: "dummy comment 2",
    createdAt: "2021-09-01T12:00:00Z",
  },
  {
    id: "dummy_comment_id_3",
    memeId: "dummy_meme_id_1",
    authorId: "dummy_user_id_3",
    content: "dummy comment 3",
    createdAt: "2021-09-01T12:00:00Z",
  },
]

export const handlers = [
  http.post<NonNullable<unknown>, { username: string; password: string }>(
    `${baseUrl}/authentication/login`,
    async ({ request }) => {
      const { username, password } = await request.json();
      if (username === "valid_user" && password === "password") {
        return HttpResponse.json({
          jwt: "dummy_token",
        });
      }
      if (username === "error_user") {
        return new HttpResponse(null, {
          status: 500,
        });
      }
      return new HttpResponse(null, {
        status: 401,
      });
    },
  ),
  http.get(
    `${baseUrl}/users`,
    async ({ request }) => {
      const url = new URL(request.url)
      const ids = url.searchParams.getAll('ids');
      if (!ids) {
        return new HttpResponse(null, {
          status: 500,
        });
      }
      const foundUsers = users.filter(u => ids.includes(u.id));
      return HttpResponse.json(foundUsers);
    },
  ),
  http.get<{ id: string }>(
    `${baseUrl}/users/:id`,
    async ({ params }) => {
      const user = users.find(u => params.id === u.id)
      if (user) {
        return HttpResponse.json(user);
      }
      return new HttpResponse(null, {
        status: 404,
      });
    },
  ),
  http.get(`${baseUrl}/memes`,
    async ({ request }) => {
      const url = new URL(request.url)
      const page = url.searchParams.get('page');
      return HttpResponse.json({
        total: memes.length,
        pageSize: 1,
        results: page ? [memes[(parseInt(page, 10) - 1)]] : [memes[0]],
      });
    }
  ),
  http.get<{ id: string }>(
    `${baseUrl}/memes/:id/comments`,
    async ({ params }) => {
      const memeComments = comments.filter(
        (comment) => comment.memeId === params.id,
      );
      return HttpResponse.json({
        total: memeComments.length,
        pageSize: memeComments.length,
        results: memeComments,
      });
    },
  ),
  http.post(`${baseUrl}/memes`, async () => {
    // request.formData() does not work here, need another solution to fake errors
    
    return HttpResponse.json({
      description: 'test',
      texts: [
        {
          content: 'caption 1',
          x: 0, 
          y: 0
        }
      ],
      id: "dummy_meme_id_4",
      authorId: "dummy_user_id_1",
      pictureUrl: "https://dummy.url/meme/4",
      commentsCount: 0,
      createdAt: "2021-09-01T12:00:00Z",
    });
  }),
  http.post<{ id: string  }, { content: string; }>(
    `${baseUrl}/memes/:id/comments`,
    async ({ request, params }) => {
      const { content } = await request.json();
      return HttpResponse.json({
        id: "dummy_comment_id_4",
        memeId: params.id,
        authorId: "dummy_user_id_1",
        content: content,
        createdAt: "2021-09-01T12:00:00Z",
      });
    },
  ),
];
