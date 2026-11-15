# API Contract

## General

- Base URL: `http://localhost:3000`.
- JSON responses unless noted otherwise.
- Dates are serialized as ISO 8601 strings.
- Errors use:

```json
{
  "error": {
    "code": "validation_error",
    "message": "Invalid input"
  }
}
```

Common status codes:

| Status | Meaning |
| --- | --- |
| `400` | Validation error or invalid JSON |
| `401` | Missing, invalid, or expired session |
| `403` | Insufficient permissions |
| `404` | Resource not found |
| `409` | Username already taken |
| `413` | Upload too large |
| `415` | Unsupported upload type |
| `500` | Internal error |

Unknown routes return a JSON `404` with code `not_found`.

## Authentication

The API uses an `httpOnly` cookie named `session`, valid for 30 days. The cookie is `SameSite=Lax` and becomes `Secure` when `NODE_ENV=production`.

User statuses:

- `pending`: can log in and read data, but cannot perform mutations.
- `active`: can perform mutations.
- `rejected`: can log in and read data, but cannot perform mutations.

Admin endpoints require an `active` user with role `admin`.

### Register

```http
POST /auth/register
```

```json
{
  "username": "ana",
  "password": "password123",
  "displayName": "Ana"
}
```

- `username`: 3-20 characters, `a-z`, `0-9`, `_`; normalized to lowercase.
- `password`: 8-128 characters.
- `displayName`: 1-40 characters.

Returns `201` with `AuthUser`, sets the session cookie, and creates a `pending` user.

### Login

```http
POST /auth/login
```

```json
{
  "username": "ana",
  "password": "password123"
}
```

Returns `200` with `AuthUser` and sets the session cookie.

### Current user

```http
GET /auth/me
```

Requires a valid session. Returns `200` with `AuthUser`.

### Logout

```http
POST /auth/logout
```

Idempotent. Deletes the session when a valid cookie is present, always clears the cookie, and returns `204`.

## Users

### List active users

```http
GET /users
```

Returns an array of active `User` objects sorted by username.

### Get public profile

```http
GET /users/:username
```

Returns an active `User`. Inactive users return `404`.

### Admin: list users

```http
GET /admin/users?status=pending&role=member
```

Requires an active admin. Both filters are optional. Returns `User[]`.

### Admin: approve or reject

```http
POST /admin/users/:id/approve
POST /admin/users/:id/reject
```

Requires an active admin. Returns the updated `User`.

## Events

Events whose author is not active are hidden from all public event reads.

### List events

```http
GET /events?userIds=uuid1,uuid2&from=2026-01-01&to=2026-12-31
```

- `userIds`: optional comma-separated list, maximum 100 UUIDs.
- `from` / `to`: optional ISO dates or date-times.
- A date-only `to` value includes the full UTC day.
- Results are sorted by `occurredAt` descending.

Returns `Event[]`.

### Event detail

```http
GET /events/:id
```

Returns `EventDetail`: the event, its comments from active authors, and its photo IDs.

### Create event

```http
POST /events
```

Requires an active user.

```json
{
  "latitude": -34.6037,
  "longitude": -58.3816,
  "occurredAt": "2026-11-13T10:00:00Z",
  "note": "Optional note",
  "placeId": "optional-place-uuid"
}
```

- `latitude`: -90 to 90.
- `longitude`: -180 to 180.
- `occurredAt`: ISO date-time with an explicit offset.
- `note`: optional, maximum 500 characters.
- `placeId`: optional UUID of an existing `Place`. Returns `404` with code `place_not_found` if it does not exist.

Returns `201` with `Event`.

### Update event

```http
PATCH /events/:id
```

Requires an active user and event ownership. Accepts any subset of `latitude`, `longitude`, `occurredAt`, `note`, and `placeId`. An empty note is stored as `null`. A `null` `placeId` detaches the event from its place. Returns `Event`.

### Delete event

```http
DELETE /events/:id
```

Requires an active user and event ownership. Deletes comments and photo records via cascading foreign keys, removes photo files from disk, and returns `204`.

## Places

Places are shared globally: one place row represents a venue for all users. Events reference a place optionally; deleting a place keeps the events and clears their `placeId`.

### Nearby places

```http
GET /places/nearby?lat=-34.6037&lng=-58.3816&radius=75
```

- `lat` / `lng`: required coordinates.
- `radius`: optional, in meters, 1-1000, defaults to `75`.

Returns `NearbyPlace[]`: places within the radius sorted by distance ascending, each with an extra `distanceMeters` field.

### Create place

```http
POST /places
```

Requires an active user.

```json
{
  "name": "Bar El Ejemplo",
  "latitude": -34.6037,
  "longitude": -58.3816
}
```

- `name`: 1-100 characters after trimming.
- `latitude`: -90 to 90.
- `longitude`: -180 to 180.

Returns `201` with `Place`.

## Comments

### Create comment

```http
POST /events/:id/comments
```

Requires an active user.

```json
{
  "body": "Comment text"
}
```

`body` must contain 1-1000 characters after trimming. Returns `201` with `Comment`.

### Delete comment

```http
DELETE /comments/:id
```

Requires an active user. Allowed for the comment author or an active admin. Returns `204`.

## Photos

Photos are hidden when their event author is inactive.

### Upload photo

```http
POST /events/:id/photos
Content-Type: multipart/form-data
```

Requires an active user. Multipart field name: `photo`.

Allowed MIME types:

- `image/jpeg`
- `image/png`
- `image/webp`
- `image/gif`

Maximum size: 10 MiB. Empty files and unsupported types are rejected.

Returns `201` with `Photo`.

### Get photo bytes

```http
GET /photos/:id
```

Public. Returns the file bytes with the stored image content type, immutable caching, and `X-Content-Type-Options: nosniff`. Missing or hidden photos return `404`.

### Delete photo

```http
DELETE /photos/:id
```

Requires an active user and must be the uploader. The uploader does not have to own the event. Returns `204` and removes the file from disk.

`Photo.url` is relative to the API base, for example `/photos/<id>`.

## Stats

### Ranking

```http
GET /stats/ranking
```

Returns active users with at least one event, ordered by total events descending, last event descending, then username ascending.

### User stats

```http
GET /stats/users/:username
```

Returns stats for an active user. Returns `404` if the user does not exist or is inactive.

## Health

```http
GET /health
```

Returns `200`:

```json
{
  "status": "ok"
}
```

## Objects

### AuthUser

```ts
{
  id: string;
  username: string;
  displayName: string;
  status: "pending" | "active" | "rejected";
  role: "member" | "admin";
  createdAt: string;
}
```

### User

```ts
{
  id: string;
  username: string;
  displayName: string;
  avatarKey: string | null;
  status: "pending" | "active" | "rejected";
  role: "member" | "admin";
  createdAt: string;
  reviewedAt: string | null;
  reviewedBy: string | null;
}
```

### Event

```ts
{
  id: string;
  userId: string;
  username: string;
  displayName: string;
  avatarKey: string | null;
  place: Place | null;
  latitude: number;
  longitude: number;
  occurredAt: string;
  note: string | null;
  createdAt: string;
}
```

### Place

```ts
{
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  createdBy: string | null;
  createdAt: string;
}
```

### NearbyPlace

```ts
Place & {
  distanceMeters: number;
}
```

### EventDetail

```ts
Event & {
  comments: Comment[];
  photoIds: string[];
}
```

### Comment

```ts
{
  id: string;
  eventId: string;
  userId: string;
  username: string;
  displayName: string;
  avatarKey: string | null;
  body: string;
  createdAt: string;
}
```

### Photo

```ts
{
  id: string;
  eventId: string;
  uploadedBy: string;
  mimeType: string;
  createdAt: string;
  url: string;
}
```

### UserStats

```ts
{
  id: string;
  username: string;
  displayName: string;
  total: number;
  month: number;
  lastEventAt: string | null;
}
```

## Admin Seed

Create the first admin with an idempotent seed script:

```bash
ADMIN_USERNAME=admin \
ADMIN_PASSWORD=admin12345 \
ADMIN_DISPLAY_NAME=Admin \
pnpm --filter api db:seed
```

`ADMIN_USERNAME` and `ADMIN_PASSWORD` are required. `ADMIN_DISPLAY_NAME` defaults to `Admin`. If the username already exists, the seed ensures the account is `active` and an `admin`, but does not overwrite its password.
