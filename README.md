# Mini Commerce Portal

A Next.js App Router + TypeScript storefront using the public DummyJSON APIs.

## Tech Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- ESLint
- DummyJSON API

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Useful Commands

```bash
npm run dev
npm run lint
npm run build
```

## Available Routes

- `/` redirects to `/products`
- `/products`
- `/products/[id]`
- `/login`
- `/account`
- `/cart`

## Test Account

```txt
username: emilys
password: emilyspass
```

## Implementation Notes

- API calls are centralized under `src/lib/api`.
- DummyJSON write operations are treated as simulated responses, not permanent persistence.
- Product browsing intentionally keeps search, category and default/sort as separate modes for API correctness.
- Cart state is local frontend state persisted in `localStorage`.
- Checkout requires login; guests can still add items to cart and manage local quantities.

## Phase 1 Status

- Project scaffolded with Next.js, TypeScript, Tailwind CSS and ESLint.
- App shell and header created.
- Required route structure created.
- Reusable DummyJSON API client wrapper created.

## Phase 2 Status

- Product list API integration created.
- Product grid, product cards, loading, error and empty states created.
- Product thumbnails are loaded from DummyJSON CDN.

## Phase 3 Status

- Pagination uses DummyJSON `limit` and `skip`.
- Category list uses `/products/categories` object responses.
- Category filtering uses `/products/category/<slug>`.
- Product list state is reflected in `/products?page=<number>&category=<slug>`.

## Phase 4 Status

- Search uses `/products/search?q=<keyword>`.
- Sort uses `/products?sortBy=<field>&order=<asc|desc>`.
- Product browsing has explicit modes: search, category, and default/sort.
- Search, category and sort are intentionally not combined for MVP API correctness.

## Phase 5 Status

- Product detail uses `/products/:id`.
- Detail page shows images, title, description, category, brand, pricing, discount, rating, stock, tags, warranty, shipping, return policy and reviews.
- Invalid or missing product IDs render a friendly not-found state.
- Quantity selector and add-to-cart behavior are implemented.

## Phase 6 Status

- Login form uses `/auth/login` with the DummyJSON test account.
- Successful login stores `accessToken`, `refreshToken` and basic user info in local storage.
- Auth state survives page refresh on the client.
- Header switches between login and logout/account actions based on local auth state.
- Logout clears local auth state and redirects to `/login`.

## Phase 7 Status

- Account page is protected on the client and redirects guests to `/login?next=/account`.
- Account profile uses `/auth/me` with `Authorization: Bearer <accessToken>`.
- Invalid `401` auth state clears the local session and redirects to login.
- Account page displays avatar, full name, email, username, gender and user ID.

## Phase 8 Status

- Cart state is managed locally on the frontend.
- Cart items persist to local storage and survive page refresh.
- Product list and detail pages can add products to cart for both guests and logged-in users.
- Cart page supports quantity updates, minimum quantity of 1, item removal, clear cart and local total calculations.
- Checkout requires login.

## Phase 9 Status

- Checkout uses `POST /carts/add`.
- Checkout request maps local cart items from `productId` to `{ id, quantity }`.
- Checkout uses the logged-in user's `id` as `userId`.
- Checkout submit is disabled while the request is in flight.
- Success UI displays returned cart `id`, `total`, `discountedTotal`, `totalProducts` and `totalQuantity`.
- Checkout copy clearly treats DummyJSON as a simulated API, not real payment or permanent order persistence.

## API Base URL

The default API base URL is:

```txt
https://dummyjson.com
```

Optionally override it with:

```txt
NEXT_PUBLIC_DUMMYJSON_BASE_URL=
```

## Manual QA Checklist

- Product list loads data from DummyJSON.
- Search uses `/products/search?q=` and returns results.
- Category filter uses category `slug` values from `/products/categories`.
- Pagination changes `skip` through `/products?page=<number>`.
- Sort uses `sortBy` and `order` on the default product list.
- Product detail page loads from `/products/:id`.
- Invalid product IDs show the friendly not-found state.
- Guest users can add products to cart and update cart quantities.
- Cart survives a browser refresh.
- Checkout prompts guest users to login.
- Login works with `emilys` / `emilyspass`.
- Account page calls `/auth/me` with a bearer token after login.
- Logged-in checkout posts current cart items to `/carts/add`.
- Checkout success displays the simulated cart response summary.
- Logout clears local auth state.

## Known Limitations

- Refresh token flow is not implemented.
- Cart and auth are client-side local state for this test.
- DummyJSON checkout is simulated and does not create a real order.
- Automated tests are not included; manual QA checklist is provided.
